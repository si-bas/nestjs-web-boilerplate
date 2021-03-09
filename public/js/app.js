window.getMeta = (metaName) => {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return '';
};

window.baseUrl = (uri = '') => {
  const url = document.getElementsByTagName('base')[0].href;

  const fullUrl = url + (isEmpty(uri) ? '' : '/' + uri);

  return fullUrl.replace(/([^:])(\/\/+)/g, '$1/');
};

window.isEmpty = (str) => {
  return !str || 0 === str.length;
};

const formValidate = (formSelector) => {
  const form = $(formSelector);

  form.find('.is-invalid').each((index, html) => {
    const formGroup = $(html);

    if (formGroup.find('.required').length < 1) {
      formGroup.removeClass('is-invalid');
    }
  });

  form.find('.required').each((index, html) => {
    const field = $(html);
    const formGroup = field.closest('.form-group');

    if (isEmpty(field.val() || null)) {
      formGroup.removeClass('is-invalid').addClass('is-invalid');
      if (formGroup.find('.invalid-feedback').length > 0) {
        formGroup.find('.invalid-feedback').html('Wajib diisi');
      } else {
        formGroup.append(
          $('<div>', {
            class: 'invalid-feedback animated fadeInDown',
            text: 'Wajib diisi',
          }),
        );
      }
    } else {
      formGroup.removeClass('is-invalid');
      formGroup.find('.invalid-feedback').remove();
    }
  });

  return form.find('.is-invalid').length === 0;
};

const getFormData = (formSelector) => {
  const form = $(formSelector);

  const unindexedArray = form.serializeArray();
  const indexedArray = {};

  $.map(unindexedArray, function (n, i) {
    indexedArray[n['name']] = n['value'];
  });

  return indexedArray;
};

$(() => {
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      errorHide();
      return response;
    },
    function (error) {
      // Do something with response error
      if (error.response.data.message) {
        const { message } = error.response.data;
        errorShow(message);
      }
      return Promise.reject(error);
    },
  );
});

const errorShow = (message) => {
  const errorDiv = $('#error-alert');
  if (errorDiv.length > 0) {
    errorDiv.find('.alert-content').html('');

    if (Array.isArray(message)) {
      const li = [];

      message.forEach((item, index) => {
        li.push(
          $('<li>', {
            text: item,
          }).prop('outerHTML'),
        );
      });

      errorDiv.find('.alert-content').html(
        $('<ul>', {
          html: li.join(' '),
        }),
      );
    } else {
      errorDiv.find('.alert-content').html(
        $('<p>', {
          text: message,
        }),
      );
    }

    errorDiv.fadeIn('slow');
  }
};

const errorHide = () => {
  const errorDiv = $('#error-alert');
  errorDiv.fadeOut('slow');
};
