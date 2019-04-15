
const bitwise = require('bitwise')
const LTC4162 = require('./ltc4162.js')

const options = {
  i2cBusNo   : 3, // defaults to 1
  i2cAddress : 0x68 // defaults to 0x77
};

const ltc4162 = new LTC4162(options)

ltc4162.init().then(() => {
  console.log('LTC4162 initialization succeeded');
  // readSensorData();
}).catch((err) => console.error(`LTC4162 initialization failed: ${err} `));
let data = Buffer.alloc(2)
ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.CHEM_CELLS_REG,2,data)

console.log(data.readUInt16LE())
let cells = bitwise.buffer.readUInt(data, 4, 4)
let chem = bitwise.buffer.readUInt(data, 12, 4)
console.log('chem: ' + chem)
console.log('cells: ' + cells)


ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.CHARGER_STATE_REG,2,data)
console.log(data.readUInt16LE())
switch(data.readUInt16LE()) {
  case 1:
    console.log('Shorted Battery')
  break
  case 2:
    console.log('Open Battery')
  break
  case 64:
    console.log('Float')
  break
  case 256:
    console.log('Suspended')
  break
  case 512:
    console.log('Absorb')
  break
  case 1024:
    console.log('Equalize')
  break
  case 512:
    console.log('Thermal Regulation')
  break
  case 1024:
    console.log('Bat Detection')
  break
  case 2048:
    console.log('Thermal Regulation')
  break
  case 4096:
    console.log('Bat Detect Failed')
  break
  default:
    console.log('None')
  break
}

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.CHARGE_STATUS_REG,2,data)
console.log(data.readUInt16LE())
switch(data.readUInt16LE()) {
  case 1:
    console.log('Constant Voltage')
  break
  case 2:
    console.log('Constant Current')
  break
  case 4:
    console.log('Input Current')
  break
  case 8:
    console.log('Input Voltage')
  break
  case 16:
    console.log('Thermal Regulation')
  break
  case 32:
    console.log('Dropout')
  break
  default:
    console.log('None')
  break
}

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.VBAT_REG,2,data)

let vbat = ltc4162.ltc4162_rline(0,1,0,(ltc4162.BATDIV/ltc4162.ADCGAIN*2),data.readUInt16LE())*cells/2
console.log('vbat: ' + vbat)

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.VIN_REG,2,data)

let vin = ltc4162.ltc4162_rline(0,1,0,(ltc4162.VINDIV/ltc4162.ADCGAIN),data.readUInt16LE())
console.log('vin: ' + vin)

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.IBAT_REG,2,data)

let ibat = ltc4162.ltc4162_rline(0,1,0,(1 / ltc4162.RSNSB / ltc4162.AVPROG / ltc4162.ADCGAIN),data.readUInt16LE())
console.log('ibat: ' + ibat)

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.IIN_REG,2,data)

let iin = ltc4162.ltc4162_rline(0,1,0,(1 / ltc4162.RSNSI / ltc4162.AVCLPROG / ltc4162.ADCGAIN),data.readUInt16LE())
console.log('iin: ' + iin)

ltc4162.i2cBus.readI2cBlockSync(ltc4162.i2cAddress, ltc4162.DIE_TEMP_REG,2,data)

let die_temp = ltc4162.ltc4162_rline(0,1,-264.4,(-264.4 + 1 / 46.557),data.readUInt16LE())
console.log('die_temp: ' + die_temp)