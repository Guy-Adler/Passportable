import eel
import os
from tkinter import Tk
from tkinter.filedialog import askopenfilename, askdirectory
from passportable import Mrz
import openpyxl as xl

eel.init('web')


@eel.expose
def ask_folder():
    """ Ask the user to select a folder """
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    folder = askdirectory(parent=root)
    root.update()
    return folder if folder != "" else None


@eel.expose
def ask_file_save_location():
    """ Ask the user where to save a file """
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_types = [('Excel File', '*.xlsx'), ('CSV File', '.csv')]
    file_path = askopenfilename(parent=root, filetypes=file_types)
    root.update()

    return file_path if file_path != '' else None


@eel.expose
def get_files(p):
    """
    Get all of the supported files from a folder
    :param p: Path to the folder
    :type p: str
    :return: A list of paths to all files
    :rtype: list[str]
    """
    images = []
    valid_extensions = ['.jpg', '.jpeg', '.png']
    for f in os.listdir(p):
        if os.path.splitext(f)[1].lower() not in valid_extensions:
            continue
        images.append(os.path.join(p, f))

    return images


@eel.expose
def save_passport(image, xlsx, y2k=30):
    wb = xl.load_workbook(xlsx)
    mrz = Mrz(image)
    if mrz.good:
        mrz.format_mrz(y2k)
        # mrz.save_to_xlsx(wb, xlsx)
        response = {'file': image, 'name': f'{mrz.mrz["names"].title()} {mrz.mrz["surname"].title()}'}
    else:
        response = {'file': f'{image}', 'name': ''}

    return response


eel.start('index.html')
