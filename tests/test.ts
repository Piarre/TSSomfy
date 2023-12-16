import Tahoma from "../out/lib/somfy";

(async () => {
  const tahoma = new Tahoma("2057-7954-6802", "pierre@ideestore.fr", "nosqyv-4qoqru-martyH");

  await tahoma.generateToken();

  console.log(await tahoma.getDevices());
})();
