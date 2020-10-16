# Passportable
Passportable takes a folder of images of passports, and converts it to a nice, readable Microsoft Excel file (.xlsx).
## How it works
Passportable goes through every image in the folder supplied, and tries to find and
read a [MRZ](https://en.wikipedia.org/wiki/Machine-readable_passport).
The MRZ is then processed, and saved to the file.
## Installation
There are two ways to install Passportable: The [easy way](#The-Easy-Way), and the [hard way](#The-Hard-Way).
### ~~The Easy Way:~~
 * ~~Install [Python (3.8.5)](https://www.python.org/downloads/release/python-385/)~~
 * ~~Use the latest installer over at the [releases](https://github.com/Guy-Adler/solid-journey/releases).~~
### The Hard Way:
 * Install [Python (3.8.5 recommended, but any version above 3.8 will probably work)](https://www.python.org/downloads/)
 * Install Tesseract OCR
   * You can use `curl -L -o tesseract-installer.exe https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-v5.0.0-alpha.20200328.exe`.
   * You can also just download the installer from the [Tessreact Repo](https://github.com/UB-Mannheim/tesseract/wiki).
 * Add the Tesseract-OCR installation folder to PATH (default `C:\Program Files\Tesseract-OCR`).
 * Install the necesarry packages using pip:
   * `pip install eel`
   * `pip install passporteye`
   * `pip install openpyxl`
   * `pip install xlrd`
 * Download or clone the repository
 * Run `ui.py`
