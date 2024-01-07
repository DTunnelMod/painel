const hideElement = (element) => {
    element.style.display = 'none';
}

const showElement = (element) => {
    element.style.removeProperty('display');
}

const showElements = (elements) => {
    elements.forEach(showElement);
}

const setRequired = (element, isRequired) => {
    if (isRequired) {
        element.setAttribute('required', isRequired);
    } else {
        element.removeAttribute('required');
    }
}

const setRequiredElements = (elements, isRequired) => {
    elements.forEach(element => setRequired(element, isRequired));
}

const getCsrfTokenHead = () => document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const getCsrfTokenRefresh = (request) => request.headers.get('csrf-token');

const doSearch = (e) => {
    let search = document.getElementById('search').value;
    let attr = e.getAttribute('href');

    if (attr.indexOf('search') > -1) {
        let split = attr.split('&');
        for (let i = 0; i < split.length; i++) {
            if (split[i].indexOf('search') > -1) {
                split[i] = 'search=' + search;
            }
        }
        attr = split.join('&');
    } else {
        attr += '&search=' + search;
    }
    e.setAttribute('href', attr);
}

const showToastSuccess = (message) => {
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        stopOnFocus: true,
    }).showToast();
};

const showToastError = (message) => {
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #b00000, #c93d3d)",
            maxWidth: '70%',
        },
        stopOnFocus: true,
    }).showToast();
};

const showToastWarning = (message) => {
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff5e62, #ff9966)",
        },
        stopOnFocus: true,
    }).showToast();
};

const showToastInfo = (message) => {
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        stopOnFocus: true,
    }).showToast();
};

const uploadImage = async (e, element) => {

    showToastInfo('Aguarde, enviando imagem...');
    //showToastWarning('Upload de imagem indisponível!');;

    const form = new FormData();
    form.append('file', e.files[0]);

    const response = await fetch('/upload/image', {
        method: 'POST',
        body: form
    });

    const data = await response.json();
    if (data.status == 200) {
        showToastSuccess('Opa! Imagem enviada com sucesso!');
        if (element) element.value = data.url;
        return data.url;
    }

    if (data.message) {
        showToastError(data.message);
        return;
    }

    showToastError('Ops! Não foi possível enviar a imagem!');
}

const copyToClipboard = data => {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(data).select();
    document.execCommand("copy");
    $temp.remove();
}

const showAlertConfirm = (callback, message) => {
    Swal.fire({
        title: 'Você tem certeza?',
        text: message || 'Você não poderá reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#212529',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        width: '25rem'
    }).then((result) => {
        if (result.value) {
            callback();
        }
    })
}