'use strict';
const bitwise = require('bitwise')

class LTC4162 {

  constructor(options) {
    const i2c = require('i2c-bus');

    this.i2cBusNo = (options && options.hasOwnProperty('i2cBusNo')) ? options.i2cBusNo : 1;    
    this.i2cBus = i2c.openSync(this.i2cBusNo);
    this.i2cAddress = (options && options.hasOwnProperty('i2cAddress')) ? options.i2cAddress : this.I2C_ADDR_68;


    this.RSNSI = 0.100
    this.RSNSB = 0.010
    this.RNTCBIAS = 10000.0
    this.RNTCSER = 0.0
    this.VINDIV = 30.0
    this.VOUTDIV = (30.0 * 1.00232)
    this.BATDIV = 3.5
    this.AVPROG = 37.5
    this.AVCLPROG = 37.5
    this.ADCGAIN = 18191.0
    this.VREF = 1.2
    this.LRm40 = 214063.67
    this.LRm34 = 152840.30
    this.LRm28 = 110480.73
    this.LRm21 = 76798.02
    this.LRm14 = 54214.99
    this.LRm6 = 37075.65
    this.LR4 = 23649.71
    this.LR33 = 7400.97
    this.LR44 = 5001.22
    this.LR53 = 3693.55
    this.LR62 = 2768.21
    this.LR70 = 2167.17
    this.LR78 = 1714.08
    this.LR86 = 1368.87
    this.LR94 = 1103.18
    this.LR102 = 896.73
    this.LR110 = 734.86
    this.LR118 = 606.86
    this.LR126 = 504.80
    this.LR134 = 422.81
    this.LR142 = 356.45
    this.LR150 = 302.36

    this.I2C_LADDR_68   = 0x68

    // this.CHIP_ID         = 0x58

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VBAT_LO_ALERT_LIMIT |
     */
    this.VBAT_LO_ALERT_LIMIT_REG = 0x01

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VBAT_HI_ALERT_LIMIT |
     */
    this.VBAT_HI_ALERT_LIMIT_REG = 0x02

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VIN_LO_ALERT_LIMIT |
     */
    this.VIN_LO_ALERT_LIMIT_REG = 0x03

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VIN_HI_ALERT_LIMIT |
     */
    this.VIN_HI_ALERT_LIMIT_REG = 0x04

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VOUT_LO_ALERT_LIMIT |
     */
    this.VOUT_LO_ALERT_LIMIT_REG = 0x05

    /*
     * |                15:0 |
     * |:-------------------:|
     * | VOUT_HI_ALERT_LIMIT |
     */
    this.VOUT_HI_ALERT_LIMIT_REG = 0x06

    /*
     * |                15:0 |
     * |:-------------------:|
     * | IIN_HI_ALERT_LIMIT  |
     */
    this.IIN_HI_ALERT_LIMIT_REG = 0x07

    /*
     * |                15:0 |
     * |:-------------------:|
     * | IBAT_LO_ALERT_LIMIT |
     */
    this.IBAT_LO_ALERT_LIMIT_REG = 0x08

    /*
     * |                    15:0 |
     * |:-----------------------:|
     * | DIE_TEMP_HI_ALERT_LIMIT |
     */
    this.DIE_TEMP_HI_ALERT_LIMIT_REG = 0x09

    /*
     * |               15:0 |
     * |:------------------:|
     * | BSR_HI_ALERT_LIMIT |
     */
    this.BSR_HI_ALERT_LIMIT_REG = 0x0A

    /*
     * |                              15:0 |
     * |:---------------------------------:|
     * | THERMISTOR_VOLTAGE_HI_ALERT_LIMIT |
     */
    this.THERMISTOR_VOLTAGE_HI_ALERT_LIMIT_REG = 0x0B

    /*
     * |                              15:0 |
     * |:---------------------------------:|
     * | THERMISTOR_VOLTAGE_LO_ALERT_LIMIT |
     */
    this.THERMISTOR_VOLTAGE_LO_ALERT_LIMIT_REG = 0x0C

    /*
     * |                       15 |                14 | 13:12 |               11 |               10 |               9 |               8 |                7 |                6 |               5 |                4 |                    3 |               2 |                              1 |                              0 |
     * |:------------------------:|:-----------------:|:-----:|:----------------:|:----------------:|:---------------:|:---------------:|:----------------:|:----------------:|:---------------:|:----------------:|:--------------------:|:---------------:|:------------------------------:|:------------------------------:|
     * | EN_TELEMETRY_VALID_ALERT | EN_BSR_DONE_ALERT |   n/a | EN_VBAT_LO_ALERT | EN_VBAT_HI_ALERT | EN_VIN_LO_ALERT | EN_VIN_HI_ALERT | EN_VOUT_LO_ALERT | EN_VOUT_HI_ALERT | EN_IIN_HI_ALERT | EN_IBAT_LO_ALERT | EN_DIE_TEMP_HI_ALERT | EN_BSR_HI_ALERT | EN_THERMISTOR_VOLTAGE_HI_ALERT | EN_THERMISTOR_VOLTAGE_LO_ALERT |
     */
    this.EN_LIMIT_ALERTS_REG = 0x0D
    /*
    EN_TELEMETRY_VALID_ALERT "EN_TELEMETRY_VALID_ALERT" : To ensure high measurement accuracy, the telemetry system in the LTC4162 has a nominal start-up time of approximately 12ms. Setting this interrupt request causes an SMBALERT telemetry_valid_alert when telemetry_valid indicates that the telemetry system's readings are valid. Note that the switching battery charger will not operate until this telemetry system warmup period has passed, regardless of the state of this setting.
    EN_BSR_DONE_ALERT "EN_BSR_DONE_ALERT" : Interrupt request that causes an SMBALERT upon bsr_done_alert when the bsr (battery-series-resistance) measurement is finished.
    EN_VBAT_LO_ALERT "EN_VBAT_LO_ALERT" : Interrupt request that causes an SMBALERT upon vbat_lo_alert when vbat is below vbat_lo_alert_limit.
    EN_VBAT_HI_ALERT "EN_VBAT_HI_ALERT" : Interrupt request that causes an SMBALERT upon vbat_hi_alert when vbat is above vbat_hi_alert_limit.
    EN_VIN_LO_ALERT "EN_VIN_LO_ALERT" : Interrupt request that causes an SMBALERT upon vin_lo_alert when vin is below vin_lo_alert_limit.
    EN_VIN_HI_ALERT "EN_VIN_HI_ALERT" : Interrupt request that causes an SMBALERT upon vin_hi_alert when vin is above vin_hi_alert_limit.
    EN_VOUT_LO_ALERT "EN_VOUT_LO_ALERT" : Interrupt request that causes an SMBALERT upon vout_lo_alert when vout is below vout_lo_alert_limit.
    EN_VOUT_HI_ALERT "EN_VOUT_HI_ALERT" : Interrupt request that causes an SMBALERT upon vout_hi_alert when vout is above vout_hi_alert_limit.
    EN_IIN_HI_ALERT "EN_IIN_HI_ALERT" : Interrupt request that causes an SMBALERT upon iin_hi_alert when iin is above iin_hi_alert_limit.
    EN_IBAT_LO_ALERT "EN_IBAT_LO_ALERT" : Interrupt request that causes an SMBALERT upon ibat_lo_alert when ibat is below ibat_lo_alert_limit.
    EN_DIE_TEMP_HI_ALERT "EN_DIE_TEMP_HI_ALERT" : Interrupt request that causes an SMBALERT upon die_temp_hi_alert when die_temp is above die_temp_hi_alert_limit.
    EN_BSR_HI_ALERT "EN_BSR_HI_ALERT" : Interrupt request that causes an SMBALERT upon bsr_hi_alert when bsr is above bsr_hi_alert_limit.
    EN_THERMISTOR_VOLTAGE_HI_ALERT "EN_THERMISTOR_VOLTAGE_HI_ALERT" : Interrupt request that causes an SMBALERT upon thermistor_voltage_hi_alert when thermistor_voltage is above thermistor_voltage_hi_alert_limit. Recall that the thermistor has a negative temperature coefficient so higher thermistor_voltage readings correspond to lower temperatures.
    EN_THERMISTOR_VOLTAGE_LO_ALERT "EN_THERMISTOR_VOLTAGE_LO_ALERT" : Interrupt request that causes an SMBALERT upon thermistor_voltage_lo_alert when thermistor_voltage is below thermistor_voltage_lo_alert_limit. Recall that the thermistor has a negative temperature coefficient so lower thermistor_voltage readings correspond to higher temperatures.
    */

    /*
     * | 15:13 |                               12 |                         11 |                       10 |                      9 |                          8 |   7 |                     6 | 5:2 |                          1 |                        0 |
     * |:-----:|:--------------------------------:|:--------------------------:|:------------------------:|:----------------------:|:--------------------------:|:---:|:---------------------:|:---:|:--------------------------:|:------------------------:|
     * |   n/a | EN_BAT_DETECT_FAILED_FAULT_ALERT | EN_BATTERY_DETECTION_ALERT | EN_EQUALIZE_CHARGE_ALERT | EN_ABSORB_CHARGE_ALERT | EN_CHARGER_SUSPENDED_ALERT | n/a | EN_CC_CV_CHARGE_ALERT | n/a | EN_BAT_MISSING_FAULT_ALERT | EN_BAT_SHORT_FAULT_ALERT |
     */
    this.EN_CHARGER_STATE_ALERTS_REG = 0x0E
    /*
    EN_BAT_DETECT_FAILED_FAULT_ALERT "EN_BAT_DETECT_FAILED_FAULT_ALERT" : Interrupt request that causes an SMBALERT upon bat_detect_failed_fault_alert as indicated by bat_detect_failed_fault due to an inability to source power to the battery during battery detection testing (usually due to either iin_limit_active or vin_uvcl_active).
    EN_BATTERY_DETECTION_ALERT "EN_BATTERY_DETECTION_ALERT" : Interrupt request that causes an SMBALERT upon battery_detection_alert as indicated by battery_detection due to the LTC4162 entering battery detection testing.
    EN_EQUALIZE_CHARGE_ALERT "EN_EQUALIZE_CHARGE_ALERT" : Interrupt request that causes an SMBALERT upon equalization_charge_alert when the equalize_charge phase of a battery charge cycle begins.
    EN_ABSORB_CHARGE_ALERT "EN_ABSORB_CHARGE_ALERT" : Interrupt request that causes an SMBALERT upon absorb_charge_alert when the absorb_charge phase of a battery charge cycle begins.
    EN_CHARGER_SUSPENDED_ALERT "EN_CHARGER_SUSPENDED_ALERT" : Interrupt request that causes an SMBALERT upon charger_suspended_alert as indicated by charger_suspended whereby battery charging is terminated due to suspend_charger.
    EN_CC_CV_CHARGE_ALERT "EN_CC_CV_CHARGE_ALERT" : Interrupt request that causes an SMBALERT upon cc_cv_charge_alert as indicated by cc_cv_charge denoting the onset of the constant current / constant voltage phase of a battery charging cycle.
    EN_BAT_MISSING_FAULT_ALERT "EN_BAT_MISSING_FAULT_ALERT" : Interrupt request that causes an SMBALERT upon bat_missing_fault_alert as indicated by bat_missing_fault whereby charging is prohibited if no battery is detected during the battery presence detection phase at the beginning of a charge cycle.
    EN_BAT_SHORT_FAULT_ALERT "EN_BAT_SHORT_FAULT_ALERT" : Interrupt request that causes an SMBALERT upon bat_short_fault_alert as indicated by bat_short_fault whereby charging is prohibited if a shorted battery is detected during the battery presence detection phase at the beginning of a charge cycle.
    */

    /*
     * | 15:6 |                        5 |                           4 |                        3 |                         2 |                         1 |                         0 |
     * |:----:|:------------------------:|:---------------------------:|:------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|
     * |  n/a | EN_ILIM_REG_ACTIVE_ALERT | EN_THERMAL_REG_ACTIVE_ALERT | EN_VIN_UVCL_ACTIVE_ALERT | EN_IIN_LIMIT_ACTIVE_ALERT | EN_CONSTANT_CURRENT_ALERT | EN_CONSTANT_VOLTAGE_ALERT |
    */
    this.EN_CHARGE_STATUS_ALERTS_REG = 0x0F
    /*
    EN_ILIM_REG_ACTIVE_ALERT "EN_ILIM_REG_ACTIVE_ALERT" : Interrupt request that causes an ilim_reg_active_alert SMBALERT upon ilim_reg_active (VCSP-VCSN greater than 45mV). May indicates that the switching regulator is currently controlling power delivery based on a safety current limit. This should not occur under normal conditions and is likely the result of a circuit board fault. Alternately indicates that the switching regulator is in dropout (near 100% duty cycle) and is not regulating on any feedback control loop.
    EN_THERMAL_REG_ACTIVE_ALERT "EN_THERMAL_REG_ACTIVE_ALERT" : Interrupt request that causes a thermal_reg_active_alert SMBALERT upon thermal_reg_active indicating that the icharge_dac is being dialed back to reduce internal die heating.
    EN_VIN_UVCL_ACTIVE_ALERT "EN_VIN_UVCL_ACTIVE_ALERT" : Interrupt request that causes a vin_uvcl_active_alert SMBALERT upon vin_uvcl_active indicating that the undervoltage regulation loop has taken control of the switching regulator.
    EN_IIN_LIMIT_ACTIVE_ALERT "EN_IIN_LIMIT_ACTIVE_ALERT" : Interrupt request that causes a iin_limit_active_alert SMBALERT upon iin_limit_active indicating that the input current regulation loop has taken control of the switching regulator.
    EN_CONSTANT_CURRENT_ALERT "EN_CONSTANT_CURRENT_ALERT" : Interrupt request that causes a constant_current_alert SMBALERT upon constant_current indicating that the battery charger constant current regulation loop has taken control of the switching regulator.
    EN_CONSTANT_VOLTAGE_ALERT "EN_CONSTANT_VOLTAGE_ALERT" : Interrupt request that causes a constant_voltage_alert SMBALERT upon constant_voltage indicating that the battery charger constant voltage regulation loop has taken control of the switching regulator.
    */

    /*
     * |                   15:0 |
     * |:----------------------:|
     * | THERMAL_REG_START_TEMP |
     */
    this.THERMAL_REG_START_TEMP_REG     = 0x10

    /*
     * |                   15:0 |
     * |:----------------------:|
     * | THERMAL_REG_END_TEMP |
     */
    this.THERMAL_REG_END_TEMP_REG = 0x11

    /*
     * | 15:6 |               5 |       4 |               3 |                  2 |       1 |            0 |
     * |:----:|:---------------:|:-------:|:---------------:|:------------------:|:-------:|:------------:|
     * |  n/a | SUSPEND_CHARGER | RUN_BSR | TELEMETRY_SPEED | FORCE_TELEMETRY_ON | MPPT_EN | EQUALIZE_REQ |
     */
    this.CONFIG_BITS_REG   = 0x14
    /*
    SUSPEND_CHARGER "SUSPEND_CHARGER" : Causes battery charging to be suspended. This setting should be used cautiously. For embedded battery systems where two wire interface communication relies on a minimum battery voltage, setting this bit could result in a deadlock that may require factory service to correct.
    RUN_BSR "RUN_BSR" : Causes the battery equivalent-series-resistance (bsr) measurement to be made as soon as a charge cycle starts or immediately if a charge cycle is already running.
    TELEMETRY_SPEED "TELEMETRY_SPEED" : Forces the telemetry system to take measurements at the higher rate of approximately once every 8ms whenever the telemetry system is on. When this bit is disabled, the telemetry system will slow down to about once every 5s to reduce power when not charging. Setting telemetry_speed to tel_high_speed in conjunction with force_telemetry_on with no input power available will increase battery drain.
    FORCE_TELEMETRY_ON "FORCE_TELEMETRY_ON" : Causes the telemetry system to operate at all times, including times when only battery power is available.
    MPPT_EN "MPPT_EN" : Causes the Maximum Power-Point Tracking algorithm to run. The maximum power point algorithm takes control of the input undervoltage regulation control loop via the input_undervoltage_dac to seek the optimum power-point for resistive sources such as a long cable or solar panel.
    EQUALIZE_REQ "EQUALIZE_REQ" : Runs, or queues up to run, an equalization phase upon completion of an absorption phase by either tabsorbtimer reaching max_absorb_time or ibat dropping below the c_over_x_threshold in absorb_charge. equalize_req will automatically self clear upon completion of an equalization phase which expires when tequalizetimer reaches max_equalize_time or the charger is suspended with suspend_charger or a power cycle. equalize_req can be written to zero at any time to cancel an equalization phase.
    */

    /*
     * | 15:6 |              5:0 |
     * |:----:|:----------------:|
     * |  n/a | IIN_LIMIT_TARGET |
     */
    this.IIN_LIMIT_TARGET_REG = 0x15

    /*
     * | 15:8 |                        7:0 |
     * |:----:|:--------------------------:|
     * |  n/a | INPUT_UNDERVOLTAGE_SETTING |
     */
    this.INPUT_UNDERVOLTAGE_SETTING_REG = 0x16

    /*
     * |          15:0 |
     * |:-------------:|
     * | ARM_SHIP_MODE |
     */
    this.ARM_SHIP_MODE_REG_SUBADDR = 0x19

    /*
     * | 15:5 |                    4:0 |
     * |:----:|:----------------------:|
     * |  n/a | CHARGE_CURRENT_SETTING |
     */
    this.CHARGE_CURRENT_SETTING_REG_SUBADDR = 0x1A

    /*
     * | 15:6 |             5:0 |
     * |:----:|:---------------:|
     * |  n/a | VCHARGE_SETTING |
     */
    this.VCHARGE_SETTING_REG = 0x1B
    const VCHARGE_SLA_DEFAULT = 21

    /*
     * |               15:0 |
     * |:------------------:|
     * | C_OVER_X_THRESHOLD |
     */
    this.C_OVER_X_THRESHOLD_REG = 0x1C
    const C_OVER_X_THRESHOLD_ENUM_C_OVER_10 = 2184

    /*
     * | 15:2 |                1 |
     * |:----:|:----------------:|
     * |  n/a | EN_SLA_TEMP_COMP |
     */
    this.CHARGER_CONFIG_BITS_REG = 0x29

    /*
     * | 15:6 |           5:0 |
     * |:----:|:-------------:|
     * |  n/a | VABSORB_DELTA |
     */
    this.VABSORB_DELTA_REG = 0x2A
    const VABSORB_DELTA_ENUM_VABSORB_SLA_DEFAULT = 21
    const VABSORB_DELTA_ENUM_VABSORB_DISABLE = 0

    /*
     * |            15:0 |
     * |:---------------:|
     * | MAX_ABSORB_TIME |
     */
    this.MAX_ABSORB_TIME_REG = 0x2B
    const MAX_ABSORB_TIME = {
      ABSORB_15MINS: 900,
      ABSORB_30MINS: 1800,
      ABSORB_1HOURS: 3600,
      ABSORB_90MINS: 5400,
      ABSORB_2HOURS: 7200
    }

    /*
     * | 15:6 |              5:0 |
     * |:----:|:----------------:|
     * |  n/a | V_EQUALIZE_DELTA |
     */
    this.V_EQUALIZE_DELTA_REG = 0x2C

    /*
     * |              15:0 |
     * |:-----------------:|
     * | MAX_EQUALIZE_TIME |
     */
    this.EQUALIZE_TIME_REG = 0x2D

    /*
     * |         15:0 |
     * |:------------:|
     * | TABSORBTIMER |
     */
    this.TABSORBTIMER_REG = 0x32

    /*
     * |           15:0 |
     * |:--------------:|
     * | TEQUALIZETIMER |
     */
    this.TEQUALIZETIMER_REG = 0x33


    /*
     * | 15:13 |          12:0 |
     * |:-----:|:-------------:|
     * |   n/a | CHARGER_STATE |
     */
    this.CHARGER_STATE_REG       = 0x34

    const CHARGER_STATE = {
      BAT_DETECT_FAILED_FAULT: 4096, //Indicates that the battery charger is not charging due to an inability to source power during the battery detection test because either vin_uvcl_active or iin_limit_active regulation was true during the battery detection phase of a charge cycle.
      BATTERY_DETECTION: 2048, //Indicates that the LTC4162 is in the battery detection phase of a charge cycle.
      EQUALIZE_CHARGE: 1024, //Indicates that the LTC4162 is in the equalize phase of charging as requested by equalize_req.
      ABSORB_CHARGE: 512, //Indicates that the LTC4162 is in the absorb, or rapid, phase of charging.
      CHARGER_SUSPENDED: 256, //Indicates that the battery charging feature is currently suspended due to suspend_charger
      CC_CV_CHARGE: 64, //Indicates that the LTC4162 is in either the constant_current or constant_voltage phase of charging.
      BAT_MISSING_FAULT: 2, //Indicates that the battery charger is not charging because no battery was found during the battery detection test at the beginning of a charge cycle or if, at any time, the thermistor_voltage goes above 21,684 indicating an open or missing thermistor.
      BAT_SHORT_FAULT: 1 //Indicates that the battery charger is not charging because the battery was found to be shorted during the battery detection test at the beginning of a charge cycle.
    }

    /*
     * | 15:6 |           5:0 |
     * |:----:|:-------------:|
     * |  n/a | CHARGE_STATUS |
     */
    this.CHARGE_STATUS_REG = 0x35
    const CHARGE_STATUS = {
      ILIM_REG_ACTIVE: 32,    // May indicate that the switching regulator is currently controlling power delivery based on a safety current limit (~45mV from CSP to CSN). This should not occur under normal conditions and is likely the result of a circuit board fault. Alternately indicates that the switching regulator is in dropout (highest possible duty cycle) and is not regulating on any feedback control loop.
      THERMAL_REG_ACTIVE: 16, // Indicates that the icharge_dac has been automatically throttled because the die_temp has reached thermal_reg_start_temp.
      VIN_UVCL_ACTIVE: 8,     // Indicates that the input voltage control loop is currently controlling power delivery to the battery based on the input_undervoltage_dac which normally targets input_undervoltage_setting. This control loop is manipulated internally when mppt_en is set.
      IIN_LIMIT_ACTIVE: 4,    // Indicates that the input current control loop is currently controlling power delivery to the battery based on iin_limit_dac which normally targets iin_limit_target.
      CONSTANT_CURRENT: 2,    // Indicates that the charge current control loop is currently controlling power delivery to the battery based on icharge_dac which normally targets charge_current_setting.
      CONSTANT_VOLTAGE: 1,    // Indicates that the charge voltage control loop is currently controlling power delivery to the battery based on vcharge_dac which normally targets vcharge_setting. This control loop is manipulated internally if en_sla_temp_comp is true.
      CHARGER_OFF: 0          // Indicates that the charger is not currently running. Due to a logic error this state may transiently appear during normal operation. Sampling it several times is recommended.
    }


    /*
    * |                    15 |             14 | 13:12 |            11 |            10 |            9 |            8 |             7 |             6 |            5 |             4 |                 3 |            2 |                           1 |                           0 |
    * |:---------------------:|:--------------:|:-----:|:-------------:|:-------------:|:------------:|:------------:|:-------------:|:-------------:|:------------:|:-------------:|:-----------------:|:------------:|:---------------------------:|:---------------------------:|
    * | TELEMETRY_VALID_ALERT | BSR_DONE_ALERT |   n/a | VBAT_LO_ALERT | VBAT_HI_ALERT | VIN_LO_ALERT | VIN_HI_ALERT | VOUT_LO_ALERT | VOUT_HI_ALERT | IIN_HI_ALERT | IBAT_LO_ALERT | DIE_TEMP_HI_ALERT | BSR_HI_ALERT | THERMISTOR_VOLTAGE_HI_ALERT | THERMISTOR_VOLTAGE_LO_ALERT |
    */
    this.LIMIT_ALERTS_REG = 0x36
    /*
    TELEMETRY_VALID_ALERT "TELEMETRY_VALID_ALERT" : Alert that indicates that the telemetry system warm-up time has expired and valid telemetry data is available from the serial port. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_telemetry_valid_alert.
    BSR_DONE_ALERT "BSR_DONE_ALERT" : Alert that indicates that the battery equivalent-series-resistance measurement is finished and a result is available in bsr. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_bsr_done_alert.
    VBAT_LO_ALERT "VBAT_LO_ALERT" : Alert that indicates that vbat is below the value set by vbat_lo_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vbat_lo_alert.
    VBAT_HI_ALERT "VBAT_HI_ALERT" : Alert that indicates that vbat is above the value set by vbat_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vbat_hi_alert.
    VIN_LO_ALERT "VIN_LO_ALERT" : Alert that indicates that vin is below the value set by vin_lo_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vin_lo_alert.
    VIN_HI_ALERT "VIN_HI_ALERT" : Alert that indicates that vin is above the value set by vin_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vin_hi_alert.
    VOUT_LO_ALERT "VOUT_LO_ALERT" : Alert that indicates that vout is below the value set by vout_lo_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vout_lo_alert.
    VOUT_HI_ALERT "VOUT_HI_ALERT" : Alert that indicates that vout is above the value set by vout_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vout_hi_alert.
    IIN_HI_ALERT "IIN_HI_ALERT" : Alert that indicates that iin is above the value set by iin_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_iin_hi_alert.
    IBAT_LO_ALERT "IBAT_LO_ALERT" : Alert that indicates that ibat is below the value set by ibat_lo_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_ibat_lo_alert.
    DIE_TEMP_HI_ALERT "DIE_TEMP_HI_ALERT" : Alert that indicates that die_temp is above the value set by die_temp_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_die_temp_hi_alert.
    BSR_HI_ALERT "BSR_HI_ALERT" : Alert that indicates that bsr is above the value set by bsr_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_bsr_hi_alert.
    THERMISTOR_VOLTAGE_HI_ALERT "THERMISTOR_VOLTAGE_HI_ALERT" : Alert that indicates that thermistor_voltage is above the value set by thermistor_voltage_hi_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_thermistor_voltage_hi_alert.
    THERMISTOR_VOLTAGE_LO_ALERT "THERMISTOR_VOLTAGE_LO_ALERT" : Alert that indicates that thermistor_voltage is below the value set by thermistor_voltage_lo_alert_limit. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_thermistor_voltage_lo_alert.
    */
    
    /*
    * | 15:13 |                            12 |                      11 |                        10 |                   9 |                       8 |   7 |                  6 | 5:2 |                       1 |                     0 |
    * |:-----:|:-----------------------------:|:-----------------------:|:-------------------------:|:-------------------:|:-----------------------:|:---:|:------------------:|:---:|:-----------------------:|:---------------------:|
    * |   n/a | BAT_DETECT_FAILED_FAULT_ALERT | BATTERY_DETECTION_ALERT | EQUALIZATION_CHARGE_ALERT | ABSORB_CHARGE_ALERT | CHARGER_SUSPENDED_ALERT | n/a | CC_CV_CHARGE_ALERT | n/a | BAT_MISSING_FAULT_ALERT | BAT_SHORT_FAULT_ALERT |
    */
    this.CHARGER_STATE_ALERTS_REG = 0x37
    /*
    BAT_DETECT_FAILED_FAULT_ALERT "BAT_DETECT_FAILED_FAULT_ALERT" : Alert that indicates a bat_detect_failed_fault. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_bat_detect_failed_fault_alert.
    BATTERY_DETECTION_ALERT "BATTERY_DETECTION_ALERT" : Alert that indicates the battery charger is performing battery_detection. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_battery_detecttion_alert.
    EQUALIZATION_CHARGE_ALERT "EQUALIZATION_CHARGE_ALERT" : Alert that indicates that the battery charger is in the equalize_charge phase. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_equalize_charge_alert.
    ABSORB_CHARGE_ALERT "ABSORB_CHARGE_ALERT" : Alert that indicates that the battery charger is in the absorb_charge phase. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_absorb_charge_alert.
    CHARGER_SUSPENDED_ALERT "CHARGER_SUSPENDED_ALERT" : Alert that indicates the battery charger is in the charger_suspended state. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_charger_suspended_alert.
    CC_CV_CHARGE_ALERT "CC_CV_CHARGE_ALERT" : Alert that indicates that the battery charge is in the cc_cv_charge phase. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_cc_cv_charge_alert.
    BAT_MISSING_FAULT_ALERT "BAT_MISSING_FAULT_ALERT" : Alert that indicates that a bat_missing_fault has been detected. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_bat_missing_fault_alert.
    BAT_SHORT_FAULT_ALERT "BAT_SHORT_FAULT_ALERT" : Alert that indicates that a bat_short_fault has been detected. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_bat_short_fault_alert.
    */

    /*
     * | 15:6 |                     5 |                        4 |                     3 |                      2 |                      1 |                      0 |
     * |:----:|:---------------------:|:------------------------:|:---------------------:|:----------------------:|:----------------------:|:----------------------:|
     * |  n/a | ILIM_REG_ACTIVE_ALERT | THERMAL_REG_ACTIVE_ALERT | VIN_UVCL_ACTIVE_ALERT | IIN_LIMIT_ACTIVE_ALERT | CONSTANT_CURRENT_ALERT | CONSTANT_VOLTAGE_ALERT |
     */
    this.CHARGE_STATUS_ALERTS_REG = 0x38
    /*
    ILIM_REG_ACTIVE_ALERT "ILIM_REG_ACTIVE_ALERT" : Alert that indicates that charge_status is ilim_reg_active. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_ilim_reg_active_alert.
    THERMAL_REG_ACTIVE_ALERT "THERMAL_REG_ACTIVE_ALERT" : Alert that indicates that charge_status is thermal_reg_active. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_thermal_reg_active_alert.
    VIN_UVCL_ACTIVE_ALERT "VIN_UVCL_ACTIVE_ALERT" : Alert that indicates that charge_status is vin_uvcl_active. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_vin_uvcl_active_alert.
    IIN_LIMIT_ACTIVE_ALERT "IIN_LIMIT_ACTIVE_ALERT" : Alert that indicates that charge_status is iin_limit_active. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_iin_limit_active_alert.
    CONSTANT_CURRENT_ALERT "CONSTANT_CURRENT_ALERT" : Alert that indicates that charge_status is constant_current. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_constant_current_alert.
    CONSTANT_VOLTAGE_ALERT "CONSTANT_VOLTAGE_ALERT" : Alert that indicates that charge_status is constant_voltage. This alert bit is cleared by writing it back to 0 with the remaining bits in this register set to 1s. It can also be cleared by clearing en_constant_voltage_alert.
    */

    /*
     * | 15:9 |      8 |              7 |   6 |     5 |                4 |        3 |           2 |           1 |              0 |
     * |:----:|:------:|:--------------:|:---:|:-----:|:----------------:|:--------:|:-----------:|:-----------:|:--------------:|
     * |  n/a | EN_CHG | CELL_COUNT_ERR | n/a | NO_RT | THERMAL_SHUTDOWN | VIN_OVLO | VIN_GT_VBAT | VIN_GT_4P2V | INTVCC_GT_2P8V |
     */
    this.SYSTEM_STATUS_REG = 0x39
    
    /*
    EN_CHG "EN_CHG" : Indicates that the battery charger is active.
    CELL_COUNT_ERR "CELL_COUNT_ERR" : A cell count error will occur and charging will be inhibited if the CELLS0 and CELLS1 pins are programmed for anything other than a 6V, 12V, 18V or 24V battery. cell_count_err always indicates true when telemetry is not enabled such as when the charger is not enabled.
    NO_RT "NO_RT" : Indicates that no frequency setting resistor is detected on the RT pin. The RT pin impedance detection circuit will typically indicate a missing RT resistor for values above 1.4MΩ. no_rt always indicates true when the battery charger is not enabled such as when there is no input power available.
    THERMAL_SHUTDOWN "THERMAL_SHUTDOWN" : Indicates that the LTC4162 is in thermal shutdown protection due to an excessively high die temperature (typically 150°C).
    VIN_OVLO "VIN_OVLO" : Indicates that input voltage shutdown protection is active due to an input voltage above its protection shut-down threshold of approximately 38.6V.
    VIN_GT_VBAT "VIN_GT_VBAT" : Indicates that the VIN pin voltage is sufficiently above the battery voltage to begin a charge cycle (typically +150mV).
    VIN_GT_4P2V "VIN_GT_4P2V" : Indicates that the VIN pin voltage is at least greater than the switching regulator under-voltage lockout level (4.2V typical).
    INTVCC_GT_2P8V "INTVCC_GT_2P8V" : Indicates that the INTVCC pin voltage is greater than the telemetry system lockout level (2.8V typical).
    */

  /*
    * | 15:0 |
    * |:----:|
    * | VBAT |
    * */
  this.VBAT_REG       = 0x3A;

  /*
    * | 15:0 |
    * |:----:|
    * |  VIN |
  */
  this.VIN_REG = 0x3B;

  /*
    * | 15:0 |
    * |:----:|
    * | VOUT 
  */
  this.VOUT_REG = 0x3C

  /*
    * | 15:0 |
    * |:----:|
    * | IBAT |
  */
  this.IBAT_REG = 0x3D

  /*
    * | 15:0 |
    * |:----:|
    * | IIN |
  */
  this.IIN_REG = 0x3E

  /*
    * | 15:0 |
    * |:----:|
    * | DIE_TEMP |
  */
  this.DIE_TEMP_REG = 0x3F

  /*
  * | 15:0 |
  * |:----:|
  * | THERMISTOR_VOLTAGE |
  */
  this.THERMISTOR_VOLTAGE_REG = 0x40

  /*
    * | 15:0 |
    * |:----:|
    * | BSR |
  */
  this.BSR_REG = 0x41

  /*
  * | 15:12 | 11:8 | 7:4 |        3:0 |
  * |:-----:|:----:|:---:|:----------:|
  * |   n/a | CHEM | n/a | CELL_COUNT |
  */
  this.CHEM_CELLS_REG = 0x43
  /*
  CHEM "CHEM" : Indicates the chemistry of the battery being charged. For additional safety, application software can test this value to ensure that the correct version of the LTC4162 (LTC4162-L, LTC4162-LiFePO4 or LTC4162-S) is populated on the circuit board.
  CELL_COUNT "CELL_COUNT" : Indicates the cell count value detected by the CELLS0 and CELLS1 pin strapping. The LTC4162 uses a cell_count value of 2 for each group of 3 physical (2V) cells (i.e. 6V cell_count = 2, 12V cell_count = 4, 18V cell_count = 6 and 24V cell_count = 8). cell_count always indicates 0 when the battery charger is not enabled such as when there is no input power available.
  */
  const CHEM = {
    CHEM_LAD: 0, // Li-Ion I²C Adjustable Voltage
    CHEM_L42: 1, // Li-Ion 4.2V Fixed Charge
    CHEM_L41: 2, // Li-Ion 4.1V Fixed Charge
    CHEM_L40: 3, // Li-Ion 4.0V Fixed Charge
    CHEM_FAD: 4, // LiFePO4 I²C Adjustable Voltage
    CHEM_FFS: 5, // LiFePO4 3.8V Rapid Charge
    CHEM_FST: 6, // LiFePO4 3.6V Fixed Charge
    CHEM_SST: 8, // Lead Acid Fixed Voltage
    CHEM_SAD: 9 // Lead Acid I²C Adjustable Voltage
  }

  const CELL_COUNT = {
    UNKNOWN: 0,
    BATTERY_6V: 2,
    BATTERY_12V: 4,
    BATTERY_18V: 6,
    BATTERY_24V: 8
  }

  /*
   * | 15:5 |         4:0 |
   * |:----:|:-----------:|
   * |  n/a | ICHARGE_DAC |
   */
  this.VBAT_FILT_REG = 0x44

  /*
   * | 15:6 |         5:0 |
   * |:----:|:-----------:|
   * |  n/a | VCHARGE_DAC | |
   */
   this.VCHARGE_DAC_REG = 0x45

  /*
   * | 15:6 |           5:0 |
   * |:----:|:-------------:|
   * |  n/a | IIN_LIMIT_DAC |
   */
  this.IIN_LIMIT_DAC_REG = 0x46

  /*
   * |      15:0 |
   * |:---------:|
   * | VBAT_FILT |
   */
  this.VBAT_FILT_REG = 0x47

  /*
   * |               15:0 |
   * |:------------------:|
   * | BSR_CHARGE_CURRENT |
   */
  this.BSR_CHARGE_CURRENT_REG = 0x48

  /*
   * | 15:2 |                1 |               0 |
   * |:----:|:----------------:|:---------------:|
   * |  n/a | BSR_QUESTIONABLE | TELEMETRY_VALID |
   */
  this.TELEMETRY_STATUS_REG = 0x4A

  /*
   * | 15:8 |                    7:0 |
   * |:----:|:----------------------:|
   * |  n/a | INPUT_UNDERVOLTAGE_DAC |
   */
  this.INPUT_UNDERVOLTAGE_DAC_REG = 0x4B

  }

  init() {
    return new Promise((resolve, reject) => {
      
      this.readSystemStatus()
      return resolve(1)

    });
  }

  readSystemStatus() {
    
    const data = this.i2cBus.readByteSync(this.i2cAddress, this.SYSTEM_STATUS_REG)
    const bits = bitwise.byte.read(data)
    console.log(bitwise.bits.toString(bits, 4))
    if (bits[7]) {
      console.log('Battery charger ON')
    } else {
      console.log('Battery charger ON')
    }

    if (bits[6]) {
      console.log('Cell count ERROR')
    } else {
      console.log('Cell count OK')
    }

    if (bits[5]) {
      console.log('Frequency Resistor not detected')
    } else {
      console.log('Frequency Resistor detected')
    }

    if (bits[4]) {
      console.log('Thermal Shutdown ON')
    } else {
      console.log('Thermal Shutdown OFF')
    }

    if (bits[3]) {
      console.log('Voltage Shutdown Protection ON')
    } else {
      console.log('Voltage Shutdown Protection OFF')
    }

    if (bits[2]) {
      console.log('Input voltage high enough for charging')
    } else {
      console.log('Input voltage too low for changing')
    }

    if (bits[1]) {
      console.log('Input voltage higher than then switching regulator undervoltage lockout level')
    } else {
      console.log('Input voltage lower than then switching regulator undervoltage lockout level')
    }

    if (bits[0]) {
      console.log('INTVCC pin voltage is higher than the telemetry system lockout level')
    } else {
      console.log('INTVCC pin voltage is lower than the telemetry system lockout level')
    }


  }

  ltc4162_rline(x0,x1,y0,y1,x) {
    return ((y0) + ((y1) - (y0))/((x1) - (x0)) * ((x) - (x0)))
  }

}

module.exports = LTC4162
