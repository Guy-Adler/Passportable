# solid-journey
**This is just a temporary edit for me to remember how to install this**
```
import os
import zipfile
from time import sleep, time
import shutil

def zero():
    print('\n' * 8)
    print(f' Wellcome to the Passportable installer. '.center(120, '~'))
    print(f'Please make sure you are connected to the internet.'.center(120, '~'))
    input(f'Press any key to start . . .'.center(120, '~'))
    os.system('cls')

# (1) Download Tesseract installer.
def one():
    url = 'https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-v5.0.0-alpha.20200328.exe'
    print('Downloading Tesseract (required to run the program):')
    input('Make sure you are connectred to the internet. Press any key to continue . . .')
    os.system(f"curl -L -o tesseract_installer.exe {url}")
    input('Downloaded Tesseract successfully. Press any key to continue . . .')

# (2) Open Tesseract installer.
def two():
    print('Please allow changes to your PC and follow the installer without changing anything:')
    sleep(3)
    os.system('tesseract_installer.exe')
    # (3) Wait until the installer is complete.
    # The installer will block, and not let the process continue until its done *TESTED!*
    os.system('setx path "%path%;C:\\Program Files\\Tesseract-OCR"')

# (4) Delete the installer.
def four():
    os.remove('tesseract_installer.exe')

# (5) Install necessary packages using pip install {package}
def five():
    print('Installing necessary packages: ')
    packages = ['eel', 'passporteye', 'openpyxl', 'xlrd', 'pywin32', 'winshell']
    start = time()
    for package in packages:
        command = 'pip install ' + package
        print(f'Installing {package}')
        s = time()
        os.system(command + ' > nul 2>&1')
        print(f'finished installing {package} (took {int(time() - s)} seconds)')
    print(f'Finished installing packages (took {int(time() - start)}) seconds')


# (6) Download the repo (.zip) from github.
def six():
    print('Downloading the code:')
    url = 'https://github.com/Guy-Adler/solid-journey/archive/main.zip'
    os.system(f"curl -L -o repo.zip {url}")

# (7) Delete C:\Passportable.
def seven():
    input('Clearing C:\\Passportable to make room for the program. Press any key to continue . . .')
    folder = 'C:\\Passportable'
    if not os.path.isdir(folder):
        os.mkdir(folder)

    else:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)

            except Exception:
                pass


# (8) Extract the repo to C:\Passportable.
def eight():
    input('Installimng the program to C:\\Passportable. Press any key to continue . . .')
    with zipfile.ZipFile('repo.zip', 'r') as zip_ref:
        zip_ref.extractall('C:\\Passportable')

    for file_name in os.listdir('C:\\Passportable\\solid-journey-main'):
        shutil.move(os.path.join('C:\\Passportable\\solid-journey-main', file_name),
        os.path.join('C:\\Passportable'))
    os.rmdir('C:\\Passportable\\solid-journey-main')
    os.remove('repo.zip')


# (9) Add shortcut to desktop.
def nine():
    print('Adding shortcuts to desktop and start menu.')
    import winshell

    desktop = winshell.desktop()
    start_apps = winshell.programs()
    winshell.CreateShortcut(
        os.path.join(desktop, 'Passportable.lnk'),
        'C:\\Passportable\\Passportable.exe',
        Icon=('C:\\Passportable\\Passportable.exe', 0)
    )
    # (10) Add shortcut to start.
    winshell.CreateShortcut(
        os.path.join(start_apps, 'Passportable.lnk'),
        'C:\\Passportable\\Passportable.exe',
        Icon=('C:\\Passportable\\Passportable.exe', 0)
    )
```
