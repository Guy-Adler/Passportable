import eel
import os
from tkinter import Tk
from tkinter.filedialog import askopenfilename, askdirectory
from passportable import Mrz
import openpyxl as xl
import time

eel.init('web')


@eel.expose
def ask_folder():
    """ Ask the user to select a folder
     :return the folder path, or None.
     """
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    folder = askdirectory(parent=root)
    root.update()
    return folder if folder != "" else None


@eel.expose
def ask_file_save_location():
    """ Ask the user where to save a file
     :return the file path, or None
     """
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)
    file_types = [('Excel File or CSV File', '*.xlsx *.csv')]
    file_path = askopenfilename(parent=root, filetypes=file_types)
    root.update()

    return file_path if file_path != '' else None


@eel.expose
def get_files(p):
    """
    Get all of the supported files from a folder
    :param p: path to the folder
    :type p: str
    :return: a list of paths to all files
    :rtype: list[str]
    """
    images = []
    valid_extensions = ['.jpg', '.jpeg', '.png']
    for f in os.listdir(p):
        if os.path.splitext(f)[1].lower() not in valid_extensions:
            continue
        images.append(os.path.join(p, f).replace('\\', '/'))

    return images


@eel.expose
def save_passport(image, xlsx, y2k=30):
    """
    Save the passport to the excel file
    :param image: path to an image
    :type image: str
    :param xlsx: path to xlsx file
    :type xlsx: str
    :param y2k: when should a century change (does 19 mean 2019 or 1919?)
    :type y2k: int
    :return: image name, name of person (if found)
    """
    wb = xl.load_workbook(xlsx)
    mrz = Mrz(image)
    if mrz.good:
        mrz.format_mrz(y2k)
        """
        if os.path.splitext(xlsx)[1].lower() == '.xlsx':
            mrz.save_to_xlsx(wb, xlsx)
        elif os.path.splitext(xlsx)[1].lower() == '.csv':
            mrz.save_to_csv(xlsx)
        """
        response = {'file': os.path.basename(image), 'name': f'{mrz.mrz["names"].title()} {mrz.mrz["surname"].title()}'}
    else:
        response = {'file': os.path.basename(image), 'name': ''}

    return response


@eel.expose
def get_images_folder_content(p):
    """
    Get a 2D list including file name and file type
    :param p: path to folder
    :type p: str
    :return: 2D list including file name and file type
    :rtype: list[list[str, str]]
    """
    images = []
    valid_extensions = ['.jpg', '.jpeg', '.png']
    try:
        for f in os.listdir(p):
            if os.path.splitext(f)[1].lower() not in valid_extensions:
                continue
            ftime = time.strftime('%A, %B %d %Y at %H:%M', time.localtime(os.path.getmtime(os.path.join(p, f))))
            fname = os.path.basename(os.path.join(p, f).replace('\\', '/'))
            images.append([fname, ftime])

        return images

    except FileNotFoundError:
        return []


eel.start('index.html', size=(900, 900))
