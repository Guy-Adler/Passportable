$(document).ready(function (){
    $('[data-toggle="tooltip"]').tooltip();
    let clipboard = new ClipboardJS('.btn-clipboard');
    clipboard.on('success', function(e) {
        e.clearSelection();
    });

});

$('.btn-clipboard').on('click', function (e) {
    $(this).attr('data-original-title', 'Copied!').tooltip('show');
});

$('.btn-clipboard').on('hide.bs.tooltip', function (e) {
    $(this).attr('data-original-title', 'Copy to clipboard');
});

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
    return await eel.save_passport(image, xlsx)();
};

const askForFolderContent = async (p) => {
    return await eel.get_images_folder_content(p)();
};

const askForOutputContent = async (p) => {
    return await eel.get_output_file_content(p)();
};

const askSave = async (images) => {
    return await eel.create_report(images)();
}