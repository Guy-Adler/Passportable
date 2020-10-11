$('#images-folder').on('click', getImagesFolderPath);
$('#output-file').on('click', getOutputFilePath);
$('#go').on('click', getMRZs);
$('#ifp').change(function () {
    if ($('#ifp').val() && $('#ofp').val()) {$('#go').prop('disabled', false);}
});
$('#ofp').change(function() {
    if ($('#ifp').val() && $('#ofp').val()) {$('#go').prop('disabled', false);}
});