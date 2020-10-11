const askForFile = async () => {
    return await eel.ask_file_save_location()();
};

const askForFolder = async () => {
    return await eel.ask_folder()();
};

const askForFiles = async (p) => {
    return await eel.get_files(p)();
};

const savePassport = async (image, xlsx) => {
    return await eel.save_passport(image, xlsx)()
};

const getImagesFolderPath = async (event) => {
    const imagesFolderPath = $('#ifp');
    const path = await askForFolder();
    if (path !== null) {
        imagesFolderPath.val(path);
    }
    const images = await askForFiles(path);
    window.images = images;
    if ($('#ifp').val() && $('#ofp').val()) {$('#go').prop('disabled', false);}
};

const getOutputFilePath = async (event) => {
    const outputFilePath = $('#ofp');
    const path = await askForFile();
    if (path !== null) {
        outputFilePath.val(path);
    }
    if ($('#ifp').val() && $('#ofp').val()) {$('#go').prop('disabled', false);}
};

const getMRZs = async (event) => {
    $('#output').removeAttr("hidden");
    const images = window.images;
    for (let i = 0; i < images.length; i++) {
        valid = await savePassport(images[i], $('#ofp').val());
        $('#prog').width(((i + 1) / images.length) * 100 + '%');
        if (valid['name'] != '') {
            $('#output_text').append(`Saved <b>${valid["name"]}\'s</b> passport. (File: <b>${valid["file"]})</b><br>`);
        } else {
            $('#output_text').append(`Skipped <b>${valid["file"]}</b> because no MRZ was found.<br>`);
        }
    }
};