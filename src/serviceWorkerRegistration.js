// serviceWorkerRegistration.js

// Determina si la aplicación se ejecuta en localhost
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:[0-9]{1,3})){3}$/)
  );
  
  // Función para registrar el Service Worker
  export function register(config) {
    if ('serviceWorker' in navigator) {
      // Verifica que la URL pública del service-worker sea válida
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
  
      // Registra el Service Worker una vez que se cargue la página
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Si está en localhost, verifica la validez del Service Worker
          checkValidServiceWorker(swUrl, config);
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'Esta aplicación web se está ejecutando en modo sin conexión.'
            );
          });
        } else {
          // Registra el Service Worker en producción
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  // Función para registrar el Service Worker válido
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Nuevo contenido está disponible
                console.log('Nuevo contenido disponible, recarga la página.');
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // Contenido está en caché para uso sin conexión
                console.log('El contenido está disponible sin conexión.');
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error durante el registro del Service Worker:', error);
      });
  }
  
  // Función para verificar si el Service Worker es válido
  function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // Si no se encuentra el archivo o no es un script, desregistra el Service Worker
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Si es válido, registra el Service Worker
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log(
          'No hay conexión a internet. La aplicación está en modo sin conexión.'
        );
      });
  }
  
  // Función para desregistrar el Service Worker
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error('Error al desregistrar el Service Worker:', error);
        });
    }
  }
  