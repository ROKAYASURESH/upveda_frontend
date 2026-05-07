$(document).ready(function () {
    $('#id_party').change(function () {
        const partyId = $(this).val();
        if (partyId) {
            $.ajax({
                url: partyDetailsUrl, // Replace this with a global variable or set it dynamically in your template
                data: { party_id: partyId },
                success: function (data) {
                    $('#id_address').val(data.address);
                    $('#id_contact_name').val(data.contact_name);
                    $('#id_contact_no').val(data.contact_no);
                }
            });
        } else {
            $('#id_address').val('');
            $('#id_contact_name').val('');
            $('#id_contact_no').val('');
        }
    });
});
