/*
    * This source code was submitted by B.Alan Christofer to Codechef development team
    * Distribution of this source code without permission is illegal
    * To claim a valid licence, please contact copyright@webxspark.com for more info
*/
var app = {
    _init_() {
        this.initEventListeners()
    },
    initEventListeners() {
        $('form').submit(function (e) {
            app.generateQRCode($(this).attr('id'));
            return false;
        })
        $('[action="download"]').click(() => {
            app.downloadImage();
        })
    },
    downloadImage() {
        var img = $('[alt="qr-code"]'),
            src = img.attr('src');
        if (src == "./assets/svg/placeholder.svg") {
            this.duDialogAlert('', '<div class="alert alert-primary" role="alert" data-mdb-color="danger">No images pending for download!</div>')
        } else {
            var fileName = 'qr-code.png';
            var blob = atob(src.split(',')[1]);
            var array = [];
            for (var i = 0; i < blob.length; i++) {
                array.push(blob.charCodeAt(i));
            }
            var blobFile = new Blob([new Uint8Array(array)], { type: 'image/png' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blobFile);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    },
    generateQRCode(formQS) {
        var text = $(`#${formQS} [name="data"]`).val();
        if($(`#${formQS} [name="data"][prepend]`).length){
            var text = $(`#${formQS} [name="data"][prepend]`).attr('prepend')+text
        }
        if (!text || text == '') {
            this.duDialogAlert("", '<div class="alert alert-primary" role="alert" data-mdb-color="primary">Please enter any text you would like to convert!</div>');
            return false;
        }
        if ($('[id="pills-whatsapp"][class="tab-pane fade row active show"]').length) {
            var phone_num = $('[name="data-pn"]').val();
            var text = `https://api.whatsapp.com/send?phone=${phone_num}&text=${encodeURIComponent(text)}`;
        }
        $.ajax({
            url: "https://apis.webxspark.com/v2.0/generators/qrcode/",
            method: "POST",
            data: {
                data: text,
                base64: true
            },
            dataType: 'JSON',
            error: (a, b) => { app.duDialogAlert("API response error!", "") },
            success: (response) => {
                var img = new Image();
                img.src = 'data:image/png;base64,' + (response.base_64);
                img.className = 'img-fluid';
                img.alt = "qr-code";
                Wxp_DOM.render(img, '#qr-image-container', { animate: { settings: 'fade' } });
            }
        })
    },
    duDialogAlert(title, html, success = (() => {
        return null;
    }), okClick = (() => {
        return null;
    })) {
        new duDialog(title, `${html}`, {
            okText: 'Ok',
            callbacks: {
                okClick: function () {
                    okClick();
                    this.hide();
                }
            }
        });
        success();
        return true;
    }
}
app._init_();