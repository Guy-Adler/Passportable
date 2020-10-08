import os
import time
import openpyxl as xl
from passporteye import read_mrz


class Mrz:
    def __init__(self, filename):
        self.filename = filename
        self.mrz = read_mrz(self.filename)
        self.good = self.mrz is not None
        if self.good:
            self.mrz = self.mrz.to_dict()
            self.mrz = {k: str(v) for k, v in self.mrz.items()}
            print(f"**Saving {self.mrz['names'].title()} {self.mrz['surname'].title()}'s passport.**")
            self.good = True
        else:
            print(f"**Skipping {os.path.split(self.filename)[1]} because no MRZ was found.**")
            self.good = False

    def format_mrz(self, y2kprefix):
        # remove all occurrences of <
        self.mrz = {k: v.replace('<', '') for k, v in self.mrz.items()}
        # arrange dates to DD/MM/YYYY instead of YYMMDD
        birth_date = self.mrz['date_of_birth']
        expiration_date = self.mrz['expiration_date']
        byear = time.strftime("%y", time.strptime(birth_date, "%y%m%d"))
        eyear = time.strftime("%y", time.strptime(expiration_date, "%y%m%d"))
        byear = f'20{byear}' if int(byear) <= int(y2kprefix) else f'19{byear}'
        eyear = f'20{eyear}' if int(eyear) <= int(y2kprefix) else f'19{eyear}'
        self.mrz['date_of_birth'] = time.strftime(f"%d/%m/{byear}", time.strptime(birth_date, "%y%m%d"))
        self.mrz['expiration_date'] = time.strftime(f"%d/%m/{eyear}", time.strptime(expiration_date, "%y%m%d"))
        if all(c in '0123456789' for c in self.mrz['number']):
            self.mrz['number'] = int(self.mrz['number'])
        # format ID:
        if self.mrz['mrz_type'] == 'TD3':
            if all(c in '0123456789' for c in self.mrz['personal_number']):
                self.mrz['personal_number'] = int(self.mrz['personal_number'])

    def save_to_xlsx(self, workbook, output_path):
        sheet = workbook.active
        row = sheet.max_row
        sheet.cell(row + 1, 1).value = row
        sheet.cell(row + 1, 2).value = self.mrz['country']
        sheet.cell(row + 1, 3).value = self.mrz['names']
        sheet.cell(row + 1, 4).value = self.mrz['surname']
        sheet.cell(row + 1, 5).value = self.mrz['number']
        sheet.cell(row + 1, 5).number_format = '0' * len(self.mrz['number'].replace('<', ''))
        sheet.cell(row + 1, 6).value = self.mrz['nationality']
        sheet.cell(row + 1, 7).value = self.mrz['date_of_birth']
        sheet.cell(row + 1, 8).value = self.mrz['sex']
        sheet.cell(row + 1, 9).value = self.mrz['expiration_date']
        if self.mrz['mrz_type'] == 'TD3':
            sheet.cell(row + 1, 10).value = self.mrz['number']
            sheet.cell(row + 1, 10).number_format = '0' * len(self.mrz['number'].replace('<', ''))

            workbook.save(output_path)
            print(f"Saved {self.mrz['names'].title()} {self.mrz['surname'].title()}'s passport.")
        else:
            print(f"Skiped {os.path.split(self.filename)[1]} because no MRZ was found")


def load(pti, ptx, prefixy2k):
    path = pti
    images = []
    valid_extensions = ['.jpg', '.jpeg', '.png']
    # Only include images (.jpg, .jpeg, .png). Other formats are not supported.
    for f in os.listdir(path):
        if os.path.splitext(f)[1].lower() not in valid_extensions:
            continue
        images.append(os.path.join(path, f))

    wb = xl.load_workbook(ptx)
    for c, f in enumerate(images):
        mrz = Mrz(f)
        if mrz.good:
            mrz.format_mrz(prefixy2k)
            mrz.save_to_xlsx(wb, ptx)
        print(f"{(c + 1) / len(images)} complete.")

    print('Finished!')
