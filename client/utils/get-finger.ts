import Fingerprint from 'fingerprintjs2';

function getFinger () {
  return new Promise((resolve) => {
    async function getHash () {
      const components = await Fingerprint.getPromise();
      const values = components.map(component => component.value);

      return String(Fingerprint.x64hash128(values.join(''), 31));
    }

    if ((window as any).requestIdleCallback) {
      (window as any).requestIdleCallback(async () => resolve(await getHash()))
    } else {
      console.log('setTimeout')
      setTimeout(async () => resolve(await getHash()), 500)
    }
  })
}

export default getFinger;
