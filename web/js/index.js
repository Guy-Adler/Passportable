//~~~~~~~~~~~~~~~~~~
// Successes, info, errors, etc. modal
const exceptionModal = (e) => {
    console.error(e);
    window.e = e;
    const exception = Object.keys(e)[0];
    const traceback = e[exception];
    let link = `mailto:guyadler2005@gmail.com?subject=${exception}&body=`;
    let body = '';
    for (let i = 0; i < traceback.length; i++) {
        body += `${traceback[i][1]}\n`
    };
    link += encodeURIComponent(body);
    const modalTitle = $('#general-modal').find('.modal-title');
    const modalBody = $('#general-modal').find('.modal-body');
    modalTitle.text('An error occurred!');
    let output = '<div class="alert alert-danger" role="alert"><div class="alert-heading">';
    output += `<h5>${exception}</h5>`;
    output += `<hr><div class="text-center"><small class="text-muted"><a href="${link}" class="alert-link" target="_blank">Contact Developer</a></small></div><hr>`;
    output += '<p id="traceback">';
    for (let i = 0; i < traceback.length; i++) {
        output += `${"&ensp;".repeat(traceback[i][0])}${traceback[i][1]}<br>`
    };
    output += '</p>'
    modalBody.html(output)
    $('#general-modal').modal('show')
};
//~~~~~~~~~~~~~~~~~~
// Button functions
//~~~~~~~~~~~~~~~~~~
const getImagesFolderPath = async (event) => {
    const imagesFolderPath = $('#ifp');
    const path = await askForFolder();
    if (path['exception']) {
        exceptionModal(path['exception'])
    } else {
        if (path['folder']) {
            imagesFolderPath.val(path['folder']);
        };
        const images = await askForFiles(path['folder']);
        window.images = images;
        if ($('#ifp').val()) {
            $('#images-folder-modal-btn').prop('disabled', false);
            if ($('#ofp').val()) {$('#go').prop('disabled', false)};
        } else {
            $('#images-folder-modal-btn').prop('disabled', true);
            $('#go').prop('disabled', true);
        };
    };
};

const getOutputFilePath = async (event) => {
    const outputFilePath = $('#ofp');
    const path = await askForFile();
    if (path['exception']) {
        exceptionModal(path['exception'])
    } else {
        if (path['file_path']) {
            outputFilePath.val(path['file_path']);
        };
        if ($('#ofp').val()) {
            $('#output-file-modal-btn').prop('disabled', false);
            if ($('#ifp').val()) {$('#go').prop('disabled', false)};
        } else {
            $('#output-file-modal-btn').prop('disabled', true);
            $('#go').prop('disabled', true);
        };
    };
};

const getMRZs = async (event) => {
    if (!window.skipped) {
        window.skipped = [];
    };
    $('#output').removeAttr("hidden");
    const images = window.images['images'];
    for (let i = 0; i < images.length; i++) {
        response = await savePassport(images[i], $('#ofp').val());
        if (response['exception']) {
            window.skipped.push(images[i]);
            exceptionModal(response['exception']);
        } else {
            $('#prog').width(((i + 1) / images.length) * 100 + '%');
            $('#percentage').text(((i + 1) / images.length) * 100 + '%');
            if (response['name']) {
                output = 'Saved <b>'
                output += response["name"]
                output += "'s</b> passport. (File: <b>"
                output += response["file"]
                output += ")</b><br>"
                $('#output_text').append(output);
            } else {
                output = 'Skipped <b>'
                output += response["file"]
                output += "</b> because no MRZ was found <br>"
                $('#output_text').append(output);
                window.skipped.push(response['file'])
            };
        };
    };
};

const getImagesFolderContent = async (event) => {
    let content = await askForFolderContent($('#ifp').val());
    if (content['exception']) {
        exceptionModal(content['exception']);
    } else {
        $('#images-folder-table').html('');
        content = content['images']
        if (content) {
            for (let i = 0; i < content.length; i++) {
                row = '<tr>';
                row += `<td>${i + 1}</td>`;
                row += `<td>${content[i][0]}</td>`;
                row += `<td>${content[i][1]}</td>`;
                row += '</tr>';
                $('#images-folder-table:last-child').append(row);
            };
        };
        $('#images-folder-modal').modal('show');
    };
};

const getOutputFileContent = async (event) => {
    let content = await askForOutputContent($('#ofp').val());
    if (content['exception']) {
        exceptionModal(content['exception']);
    } else {
        $('#output-file-table').html('');
        content = content['table'];
        if (content) {
            row = '<thead><tr>';
            for (let j = 0; j < content[0].length; j++) {
                row += `<th scope="col">${content[0][j]}</th>`;
            };
            row += '</tr></thead><tbody id="output-file-table"></tbody>';
            $('#output-table').append(row);
            for (let i = 1; i < content.length; i++) {
                row = '<tr>';
                for (let j = 0; j < content[i].length; j++) {
                    row += `<td>${content[i][j]}</td>`;
                };
                row += '</td>';
                $('#output-file-table:last-child').append(row);
            };
        };
       $('#output-file-modal').modal('show');
   };
};
//~~~~~~~~~~~~~~~~~~
// Event handling
//~~~~~~~~~~~~~~~~~~
$('#images-folder').on('click', getImagesFolderPath);
$('#output-file').on('click', getOutputFilePath);
$('#go').on('click', getMRZs);
$('#images-folder-modal-btn').on('click', getImagesFolderContent);
$('#output-file-modal-btn').on('click', getOutputFileContent);
$('#general-modal').on('hidden.bs.modal', function (e) {
    $('#general-modal').find('.modal-title').text('');
    $('#general-modal').find('.modal-body').html('');
});
//~~~~~~~~~~~~~~~~~~
// Toggle buttons
//~~~~~~~~~~~~~~~~~~
$('#ifp').change(function () {
    if ($('#ifp').val()) {
        $('#images-folder-modal-btn').prop('disabled', false);
        if ($('#ofp').val()) {$('#go').prop('disabled', false)};
    } else {
        $('#images-folder-modal-btn').prop('disabled', true);
        $('#go').prop('disabled', true);
    };
});

$('#ofp').change(function() {
    if ($('#ofp').val()) {
        $('#output-file-modal-btn').prop('disabled', false);
        if ($('#ifp').val()) {$('#go').prop('disabled', false)};
    } else {
        $('#output-file-modal-btn').prop('disabled', true);
        $('#go').prop('disabled', true);
    };
});