#ifndef RTW_HEADER_A380PrimComputer_h_
#define RTW_HEADER_A380PrimComputer_h_
#include "rtwtypes.h"
#include "A380PrimComputer_types.h"
#include "A380LateralNormalLaw.h"
#include "A380LateralDirectLaw.h"
#include "A380PitchNormalLaw.h"
#include "A380PitchAlternateLaw.h"
#include "A380PitchDirectLaw.h"

extern const real_T A380PrimComputer_RGND;
extern const boolean_T A380PrimComputer_BGND;
extern base_prim_logic_outputs rtP_prim_logic_output_MATLABStruct;
extern base_prim_laws_outputs rtP_prim_laws_output_MATLABStruct;
extern base_prim_analog_outputs rtP_prim_analog_output_MATLABStruct;
extern base_prim_discrete_outputs rtP_prim_discrete_output_MATLABStruct;
class A380PrimComputer final
{
 public:
  struct rtDW_RateLimiter_A380PrimComputer_T {
    real_T pY;
    boolean_T pY_not_empty;
  };

  struct rtDW_RateLimiter_A380PrimComputer_g_T {
    real_T pY;
    boolean_T pY_not_empty;
  };

  struct rtDW_RateLimiter_A380PrimComputer_d_T {
    real_T pY;
    boolean_T pY_not_empty;
  };

  struct rtDW_LagFilter_A380PrimComputer_T {
    real_T pY;
    real_T pU;
    boolean_T pY_not_empty;
    boolean_T pU_not_empty;
  };

  struct rtDW_MATLABFunction_A380PrimComputer_j_T {
    boolean_T previousInput;
    boolean_T previousInput_not_empty;
  };

  struct rtDW_MATLABFunction_A380PrimComputer_k_T {
    real_T timeSinceCondition;
    boolean_T output;
  };

  struct rtDW_MATLABFunction_A380PrimComputer_km_T {
    boolean_T output;
  };

  struct rtDW_RateLimiter_A380PrimComputer_b_T {
    real_T pY;
    boolean_T pY_not_empty;
  };

  struct D_Work_A380PrimComputer_T {
    real_T Delay_DSTATE;
    real_T Delay_DSTATE_c;
    real_T configFullEventTime;
    real_T eventTime;
    real_T resetEventTime;
    real_T eventTime_g;
    boolean_T Delay_DSTATE_cc;
    boolean_T Delay1_DSTATE;
    boolean_T Delay1_DSTATE_b;
    boolean_T Delay_DSTATE_f;
    uint8_T is_active_c28_A380PrimComputer;
    uint8_T is_c28_A380PrimComputer;
    boolean_T Memory_PreviousInput;
    boolean_T Memory_PreviousInput_j;
    boolean_T icLoad;
    boolean_T pLeftStickDisabled;
    boolean_T pRightStickDisabled;
    boolean_T configFullEventTime_not_empty;
    boolean_T ra1CoherenceRejected;
    boolean_T ra2CoherenceRejected;
    boolean_T eventTime_not_empty;
    boolean_T resetEventTime_not_empty;
    boolean_T sProtActive;
    boolean_T eventTime_not_empty_a;
    boolean_T abnormalConditionWasActive;
    boolean_T Runtime_MODE;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_al4;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_nu;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_g4;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_j2;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_g24;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_lf;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_jl;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_jz;
    rtDW_RateLimiter_A380PrimComputer_b_T sf_RateLimiter_mr;
    rtDW_RateLimiter_A380PrimComputer_b_T sf_RateLimiter_ne;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_nb;
    rtDW_MATLABFunction_A380PrimComputer_km_T sf_MATLABFunction_br;
    rtDW_MATLABFunction_A380PrimComputer_km_T sf_MATLABFunction_jg;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_gfx;
    rtDW_MATLABFunction_A380PrimComputer_k_T sf_MATLABFunction_cj;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_jj;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_ej;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_ja;
    rtDW_MATLABFunction_A380PrimComputer_j_T sf_MATLABFunction_mb;
    rtDW_LagFilter_A380PrimComputer_T sf_LagFilter_a;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_ph;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_cda;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_p;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_cr;
    rtDW_LagFilter_A380PrimComputer_T sf_LagFilter;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_cd;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_j4;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_iy;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_np;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_lm;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_mn;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_au;
    rtDW_RateLimiter_A380PrimComputer_d_T sf_RateLimiter_md;
    rtDW_RateLimiter_A380PrimComputer_d_T sf_RateLimiter_me;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_f1;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_i;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_nl;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_gm;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_f;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_j;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_n2;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_bo;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_k;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_nh;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_gr;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_m;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_c5;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_d;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_l;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_n;
    rtDW_RateLimiter_A380PrimComputer_g_T sf_RateLimiter_a;
    rtDW_RateLimiter_A380PrimComputer_T sf_RateLimiter_g;
    rtDW_RateLimiter_A380PrimComputer_T sf_RateLimiter_c;
    rtDW_RateLimiter_A380PrimComputer_T sf_RateLimiter_b;
    rtDW_RateLimiter_A380PrimComputer_T sf_RateLimiter;
  };

  struct ExternalInputs_A380PrimComputer_T {
    prim_inputs in;
  };

  struct ExternalOutputs_A380PrimComputer_T {
    prim_outputs out;
  };

  struct Parameters_A380PrimComputer_T {
    real_T LagFilter_C1;
    real_T LagFilter_C1_e;
    real_T DiscreteDerivativeVariableTs_Gain;
    real_T DiscreteTimeIntegratorVariableTsLimit_Gain;
    real_T RateLimiterVariableTs2_InitialCondition;
    real_T RateLimiterVariableTs3_InitialCondition;
    real_T RateLimiterVariableTs4_InitialCondition;
    real_T RateLimiterVariableTs6_InitialCondition;
    real_T RateLimiterGenericVariableTs24_InitialCondition;
    real_T RateLimiterGenericVariableTs25_InitialCondition;
    real_T DiscreteDerivativeVariableTs_InitialCondition;
    real_T BitfromLabel_bit;
    real_T BitfromLabel1_bit;
    real_T BitfromLabel2_bit;
    real_T BitfromLabel1_bit_b;
    real_T BitfromLabel1_bit_n;
    real_T BitfromLabel3_bit;
    real_T BitfromLabel2_bit_l;
    real_T BitfromLabel1_bit_bv;
    real_T BitfromLabel1_bit_k;
    real_T BitfromLabel2_bit_e;
    real_T BitfromLabel3_bit_c;
    real_T BitfromLabel4_bit;
    real_T BitfromLabel6_bit;
    real_T BitfromLabel9_bit;
    real_T BitfromLabel10_bit;
    real_T BitfromLabel5_bit;
    real_T BitfromLabel7_bit;
    real_T BitfromLabel8_bit;
    real_T BitfromLabel_bit_i;
    real_T BitfromLabel1_bit_c;
    real_T BitfromLabel2_bit_p;
    real_T BitfromLabel3_bit_n;
    real_T BitfromLabel4_bit_j;
    real_T BitfromLabel5_bit_i;
    real_T BitfromLabel6_bit_j;
    real_T BitfromLabel7_bit_n;
    real_T BitfromLabel8_bit_n;
    real_T BitfromLabel9_bit_b;
    real_T BitfromLabel10_bit_h;
    real_T BitfromLabel11_bit;
    real_T BitfromLabel14_bit;
    real_T BitfromLabel15_bit;
    real_T BitfromLabel16_bit;
    real_T BitfromLabel17_bit;
    real_T BitfromLabel1_bit_g;
    real_T BitfromLabel2_bit_pc;
    real_T BitfromLabel1_bit_i;
    real_T BitfromLabel2_bit_n;
    real_T BitfromLabel1_bit_nd;
    real_T BitfromLabel2_bit_d;
    real_T BitfromLabel8_bit_l;
    real_T BitfromLabel9_bit_g;
    real_T BitfromLabel10_bit_j;
    real_T BitfromLabel11_bit_j;
    real_T BitfromLabel14_bit_p;
    real_T BitfromLabel15_bit_i;
    real_T BitfromLabel12_bit;
    real_T BitfromLabel13_bit;
    real_T BitfromLabel1_bit_l;
    real_T BitfromLabel2_bit_f;
    real_T BitfromLabel1_bit_p;
    real_T BitfromLabel2_bit_b;
    real_T BitfromLabel16_bit_b;
    real_T BitfromLabel17_bit_i;
    real_T BitfromLabel18_bit;
    real_T BitfromLabel19_bit;
    real_T BitfromLabel20_bit;
    real_T BitfromLabel21_bit;
    real_T BitfromLabel22_bit;
    real_T BitfromLabel23_bit;
    real_T BitfromLabel1_bit_lr;
    real_T BitfromLabel2_bit_g;
    real_T BitfromLabel3_bit_k;
    real_T BitfromLabel4_bit_n;
    real_T BitfromLabel5_bit_e;
    real_T BitfromLabel6_bit_b;
    real_T BitfromLabel7_bit_p;
    real_T BitfromLabel8_bit_d;
    real_T BitfromLabel9_bit_e;
    real_T BitfromLabel11_bit_n;
    real_T BitfromLabel38_bit;
    real_T BitfromLabel39_bit;
    real_T BitfromLabel32_bit;
    real_T BitfromLabel33_bit;
    real_T BitfromLabel36_bit;
    real_T BitfromLabel37_bit;
    real_T BitfromLabel3_bit_m;
    real_T BitfromLabel4_bit_b;
    real_T BitfromLabel1_bit_pt;
    real_T BitfromLabel2_bit_h;
    real_T BitfromLabel5_bit_d;
    real_T BitfromLabel6_bit_p;
    real_T BitfromLabel7_bit_g;
    real_T BitfromLabel8_bit_i;
    real_T BitfromLabel_bit_o;
    real_T BitfromLabel1_bit_e;
    real_T BitfromLabel2_bit_hr;
    real_T BitfromLabel6_bit_k;
    real_T BitfromLabel3_bit_l;
    real_T BitfromLabel4_bit_bl;
    real_T BitfromLabel5_bit_p;
    real_T BitfromLabel7_bit_h;
    real_T BitfromLabel_bit_h;
    real_T BitfromLabel1_bit_gs;
    real_T BitfromLabel2_bit_nu;
    real_T BitfromLabel3_bit_g;
    real_T BitfromLabel4_bit_e;
    real_T BitfromLabel5_bit_a;
    real_T BitfromLabel_bit_e;
    real_T BitfromLabel1_bit_d;
    real_T BitfromLabel_bit_l;
    real_T BitfromLabel_bit_p;
    real_T BitfromLabel1_bit_h;
    real_T BitfromLabel2_bit_fv;
    real_T BitfromLabel3_bit_cv;
    real_T BitfromLabel4_bit_n4;
    real_T BitfromLabel5_bit_py;
    real_T BitfromLabel_bit_n;
    real_T BitfromLabel1_bit_h1;
    real_T BitfromLabel2_bit_gn;
    real_T BitfromLabel3_bit_b;
    real_T BitfromLabel4_bit_i;
    real_T BitfromLabel5_bit_l;
    real_T BitfromLabel_bit_of;
    real_T CompareToConstant_const;
    real_T CompareToConstant_const_l;
    real_T CompareToConstant3_const;
    real_T CompareToConstant4_const;
    real_T CompareToConstant1_const;
    real_T CompareToConstant2_const;
    real_T CompareToConstant_const_n;
    real_T CompareToConstant23_const;
    real_T CompareToConstant21_const;
    real_T CompareToConstant22_const;
    real_T CompareToConstant24_const;
    real_T CompareToConstant5_const;
    real_T CompareToConstant6_const;
    real_T CompareToConstant19_const;
    real_T CompareToConstant20_const;
    real_T CompareToConstant_const_m;
    real_T CompareToConstant15_const;
    real_T CompareToConstant1_const_p;
    real_T CompareToConstant2_const_i;
    real_T CompareToConstant3_const_e;
    real_T CompareToConstant4_const_c;
    real_T CompareToConstant13_const;
    real_T CompareToConstant14_const;
    real_T CompareToConstant10_const;
    real_T CompareToConstant7_const;
    real_T CompareToConstant16_const;
    real_T CompareToConstant17_const;
    real_T CompareToConstant18_const;
    real_T CompareToConstant8_const;
    real_T CompareToConstant9_const;
    real_T CompareToConstant_const_m4;
    real_T CompareToConstant_const_f;
    real_T CompareToConstant2_const_f;
    real_T CompareToConstant3_const_o;
    real_T CompareToConstant4_const_o;
    real_T CompareToConstant5_const_b;
    real_T CompareToConstant1_const_pv;
    real_T CompareToConstant1_const_d;
    real_T HysteresisNode2_highTrigger;
    real_T HysteresisNode3_highTrigger;
    real_T RateLimiterGenericVariableTs_lo;
    real_T RateLimiterGenericVariableTs1_lo;
    real_T RateLimiterVariableTs2_lo;
    real_T RateLimiterVariableTs3_lo;
    real_T RateLimiterGenericVariableTs_lo_k;
    real_T RateLimiterGenericVariableTs1_lo_i;
    real_T RateLimiterGenericVariableTs2_lo;
    real_T RateLimiterGenericVariableTs3_lo;
    real_T RateLimiterGenericVariableTs4_lo;
    real_T RateLimiterGenericVariableTs5_lo;
    real_T RateLimiterVariableTs4_lo;
    real_T RateLimiterVariableTs6_lo;
    real_T RateLimiterGenericVariableTs24_lo;
    real_T RateLimiterGenericVariableTs25_lo;
    real_T RateLimiterGenericVariableTs8_lo;
    real_T RateLimiterGenericVariableTs9_lo;
    real_T RateLimiterGenericVariableTs10_lo;
    real_T RateLimiterGenericVariableTs11_lo;
    real_T RateLimiterGenericVariableTs14_lo;
    real_T RateLimiterGenericVariableTs15_lo;
    real_T RateLimiterGenericVariableTs12_lo;
    real_T RateLimiterGenericVariableTs13_lo;
    real_T RateLimiterGenericVariableTs18_lo;
    real_T RateLimiterGenericVariableTs19_lo;
    real_T RateLimiterGenericVariableTs16_lo;
    real_T RateLimiterGenericVariableTs17_lo;
    real_T RateLimiterGenericVariableTs22_lo;
    real_T RateLimiterGenericVariableTs23_lo;
    real_T RateLimiterGenericVariableTs20_lo;
    real_T RateLimiterGenericVariableTs21_lo;
    real_T RateLimiterGenericVariableTs6_lo;
    real_T RateLimiterGenericVariableTs7_lo;
    real_T RateLimiterGenericVariableTs_lo_f;
    real_T RateLimiterGenericVariableTs1_lo_c;
    real_T RateLimiterGenericVariableTs2_lo_k;
    real_T RateLimiterGenericVariableTs3_lo_k;
    real_T HysteresisNode2_lowTrigger;
    real_T HysteresisNode3_lowTrigger;
    real_T ConfirmNode_timeDelay;
    real_T ConfirmNode2_timeDelay;
    real_T ConfirmNode1_timeDelay;
    real_T ConfirmNode_timeDelay_n;
    real_T ConfirmNode2_timeDelay_k;
    real_T ConfirmNode_timeDelay_d;
    real_T ConfirmNode1_timeDelay_a;
    real_T ConfirmNode_timeDelay_a;
    real_T ConfirmNode_timeDelay_g;
    real_T RateLimiterGenericVariableTs_up;
    real_T RateLimiterGenericVariableTs1_up;
    real_T RateLimiterVariableTs2_up;
    real_T RateLimiterVariableTs3_up;
    real_T RateLimiterGenericVariableTs_up_b;
    real_T RateLimiterGenericVariableTs1_up_k;
    real_T RateLimiterGenericVariableTs2_up;
    real_T RateLimiterGenericVariableTs3_up;
    real_T RateLimiterGenericVariableTs4_up;
    real_T RateLimiterGenericVariableTs5_up;
    real_T RateLimiterVariableTs4_up;
    real_T RateLimiterVariableTs6_up;
    real_T RateLimiterGenericVariableTs24_up;
    real_T RateLimiterGenericVariableTs25_up;
    real_T RateLimiterGenericVariableTs8_up;
    real_T RateLimiterGenericVariableTs9_up;
    real_T RateLimiterGenericVariableTs10_up;
    real_T RateLimiterGenericVariableTs11_up;
    real_T RateLimiterGenericVariableTs14_up;
    real_T RateLimiterGenericVariableTs15_up;
    real_T RateLimiterGenericVariableTs12_up;
    real_T RateLimiterGenericVariableTs13_up;
    real_T RateLimiterGenericVariableTs18_up;
    real_T RateLimiterGenericVariableTs19_up;
    real_T RateLimiterGenericVariableTs16_up;
    real_T RateLimiterGenericVariableTs17_up;
    real_T RateLimiterGenericVariableTs22_up;
    real_T RateLimiterGenericVariableTs23_up;
    real_T RateLimiterGenericVariableTs20_up;
    real_T RateLimiterGenericVariableTs21_up;
    real_T RateLimiterGenericVariableTs6_up;
    real_T RateLimiterGenericVariableTs7_up;
    real_T RateLimiterGenericVariableTs_up_a;
    real_T RateLimiterGenericVariableTs1_up_a;
    real_T RateLimiterGenericVariableTs2_up_l;
    real_T RateLimiterGenericVariableTs3_up_j;
    SignStatusMatrix EnumeratedConstant1_Value;
    SignStatusMatrix EnumeratedConstant_Value;
    a380_pitch_efcs_law EnumeratedConstant_Value_b;
    real32_T CompareToConstant_const_ll;
    boolean_T SRFlipFlop_initial_condition;
    boolean_T SRFlipFlop_initial_condition_c;
    boolean_T ConfirmNode_isRisingEdge;
    boolean_T ConfirmNode2_isRisingEdge;
    boolean_T ConfirmNode1_isRisingEdge;
    boolean_T ConfirmNode_isRisingEdge_k;
    boolean_T ConfirmNode2_isRisingEdge_j;
    boolean_T ConfirmNode_isRisingEdge_o;
    boolean_T PulseNode_isRisingEdge;
    boolean_T PulseNode1_isRisingEdge;
    boolean_T ConfirmNode1_isRisingEdge_k;
    boolean_T ConfirmNode_isRisingEdge_j;
    boolean_T ConfirmNode_isRisingEdge_c;
    boolean_T PulseNode3_isRisingEdge;
    boolean_T PulseNode2_isRisingEdge;
    boolean_T PulseNode1_isRisingEdge_c;
    boolean_T PulseNode_isRisingEdge_n;
    prim_outputs out_Y0;
    base_prim_out_bus Constant4_Value;
    real_T Constant5_Value;
    real_T Constant6_Value;
    real_T Constant9_Value;
    real_T uDLookupTable_tableData[5];
    real_T uDLookupTable_bp01Data[5];
    real_T Constant2_Value;
    real_T Constant1_Value;
    real_T Constant4_Value_a;
    real_T Constant3_Value;
    real_T Constant_Value;
    real_T Constant2_Value_l;
    real_T Constant3_Value_h;
    real_T Constant10_Value;
    real_T Constant11_Value;
    real_T Constant1_Value_n;
    real_T Constant2_Value_k;
    real_T Constant3_Value_g;
    real_T Constant4_Value_i;
    real_T Constant5_Value_n;
    real_T Constant6_Value_f;
    real_T Constant7_Value;
    real_T Constant8_Value;
    real_T Constant9_Value_n;
    real_T Constant_Value_b;
    real_T Constant_Value_p;
    real_T Saturation_UpperSat;
    real_T Saturation_LowerSat;
    real_T Constant1_Value_p;
    real_T Saturation1_UpperSat;
    real_T Saturation1_LowerSat;
    real_T alphamax_tableData[24];
    real_T alphamax_bp01Data[4];
    real_T alphamax_bp02Data[6];
    real_T alphaprotection_tableData[24];
    real_T alphaprotection_bp01Data[4];
    real_T alphaprotection_bp02Data[6];
    real_T Constant5_Value_k;
    real_T Constant6_Value_b;
    real_T Constant7_Value_g;
    real_T Constant8_Value_h;
    real_T Gain1_Gain;
    real_T uDLookupTable1_tableData[4];
    real_T uDLookupTable1_bp01Data[4];
    real_T uDLookupTable2_tableData[4];
    real_T uDLookupTable2_bp01Data[4];
    real_T uDLookupTable_tableData_n[4];
    real_T uDLookupTable_bp01Data_m[4];
    real_T Constant_Value_a;
    real_T Constant_Value_c;
    real_T Gain_Gain;
    real_T Saturation2_UpperSat;
    real_T Saturation2_LowerSat;
    real_T Saturation1_UpperSat_a;
    real_T Saturation1_LowerSat_p;
    real_T Gain3_Gain;
    real_T Saturation3_UpperSat;
    real_T Saturation3_LowerSat;
    real_T Saturation4_UpperSat;
    real_T Saturation4_LowerSat;
    real_T Gain4_Gain;
    real_T Gain5_Gain;
    real_T Constant8_Value_d;
    real_T Constant_Value_g;
    real_T Constant_Value_af;
    real32_T Constant10_Value_l;
    real32_T Constant9_Value_m;
    real32_T Constant8_Value_hh;
    real32_T Constant7_Value_j;
    real32_T Constant6_Value_k;
    real32_T Constant5_Value_g;
    real32_T Constant4_Value_a5;
    real32_T Constant3_Value_ge;
    real32_T Constant2_Value_c;
    real32_T Constant1_Value_nj;
    real32_T Constant14_Value;
    real32_T Constant15_Value;
    real32_T Constant24_Value;
    real32_T Constant23_Value;
    real32_T Constant26_Value;
    real32_T Constant25_Value;
    real32_T Constant28_Value;
    real32_T Constant27_Value;
    real32_T Constant30_Value;
    real32_T Constant29_Value;
    real32_T Constant32_Value;
    real32_T Constant13_Value;
    real32_T Constant31_Value;
    real32_T Constant33_Value;
    real32_T Constant34_Value;
    real32_T Constant35_Value;
    real32_T Constant12_Value;
    real32_T Constant11_Value_l;
    real32_T Constant20_Value;
    real32_T Gain_Gain_b;
    real32_T Gain1_Gain_f;
    real32_T Gain2_Gain;
    real32_T Gain3_Gain_g;
    real32_T Gain4_Gain_l;
    uint32_T alphamax_maxIndex[2];
    uint32_T alphaprotection_maxIndex[2];
    boolean_T Constant1_Value_b;
    boolean_T Constant_Value_ad;
    boolean_T Delay_InitialCondition;
    boolean_T Delay1_InitialCondition;
    boolean_T reset_Value;
    boolean_T reset_Value_j;
    boolean_T Constant_Value_h;
    boolean_T Logic_table[16];
    boolean_T Logic_table_h[16];
    boolean_T Delay1_InitialCondition_n;
    boolean_T Delay_InitialCondition_d;
    boolean_T reset_Value_f;
    boolean_T Constant7_Value_n;
    boolean_T reset_Value_l;
    boolean_T Constant1_Value_f;
    boolean_T Constant_Value_ba;
    boolean_T Constant16_Value;
    boolean_T Constant17_Value;
    boolean_T Constant18_Value;
    boolean_T Constant19_Value;
    boolean_T Constant21_Value;
    boolean_T Constant22_Value;
  };

  A380PrimComputer(A380PrimComputer const&) = delete;
  A380PrimComputer& operator= (A380PrimComputer const&) & = delete;
  A380PrimComputer(A380PrimComputer &&) = delete;
  A380PrimComputer& operator= (A380PrimComputer &&) = delete;
  void setExternalInputs(const ExternalInputs_A380PrimComputer_T *pExternalInputs_A380PrimComputer_T)
  {
    A380PrimComputer_U = *pExternalInputs_A380PrimComputer_T;
  }

  const ExternalOutputs_A380PrimComputer_T &getExternalOutputs() const
  {
    return A380PrimComputer_Y;
  }

  void initialize();
  void step();
  static void terminate();
  A380PrimComputer();
  ~A380PrimComputer();
 private:
  ExternalInputs_A380PrimComputer_T A380PrimComputer_U;
  ExternalOutputs_A380PrimComputer_T A380PrimComputer_Y;
  D_Work_A380PrimComputer_T A380PrimComputer_DWork;
  static Parameters_A380PrimComputer_T A380PrimComputer_P;
  static void A380PrimComputer_RateLimiter_Reset(rtDW_RateLimiter_A380PrimComputer_T *localDW);
  static void A380PrimComputer_RateLimiter(real_T rtu_u, real_T rtu_up, real_T rtu_lo, real_T rtu_Ts, real_T rtu_init,
    real_T *rty_Y, rtDW_RateLimiter_A380PrimComputer_T *localDW);
  static void A380PrimComputer_RateLimiter_b_Reset(rtDW_RateLimiter_A380PrimComputer_g_T *localDW);
  static void A380PrimComputer_RateLimiter_a(real_T rtu_u, real_T rtu_up, real_T rtu_lo, real_T rtu_Ts, real_T rtu_init,
    boolean_T rtu_reset, real_T *rty_Y, rtDW_RateLimiter_A380PrimComputer_g_T *localDW);
  static void A380PrimComputer_RateLimiter_bb_Reset(rtDW_RateLimiter_A380PrimComputer_d_T *localDW);
  static void A380PrimComputer_RateLimiter_m(real_T rtu_u, real_T rtu_up, real_T rtu_lo, real_T rtu_Ts, real_T rtu_init,
    boolean_T rtu_reset, real_T *rty_Y, rtDW_RateLimiter_A380PrimComputer_d_T *localDW);
  static void A380PrimComputer_Spoiler12SpeedbrakeGain(real_T rtu_spdBrkDeflection, real_T *rty_spdBrkDeflectionOut);
  static void A380PrimComputer_Spoiler345Computation(real_T rtu_xiSplr, real_T rtu_speedBrakeDeflection, real_T
    *rty_leftCommand, real_T *rty_rightCommand);
  static void A380PrimComputer_MATLABFunction(const base_arinc_429 *rtu_u, boolean_T *rty_y);
  static void A380PrimComputer_MATLABFunction_e(const base_arinc_429 *rtu_u, real_T rtu_bit, uint32_T *rty_y);
  static void A380PrimComputer_MATLABFunction_o(boolean_T rtu_bit1, boolean_T rtu_bit2, boolean_T rtu_bit3, boolean_T
    rtu_bit4, boolean_T rtu_bit5, boolean_T rtu_bit6, real_T *rty_handleIndex);
  static void A380PrimComputer_LagFilter_Reset(rtDW_LagFilter_A380PrimComputer_T *localDW);
  static void A380PrimComputer_LagFilter(real_T rtu_U, real_T rtu_C1, real_T rtu_dt, real_T *rty_Y,
    rtDW_LagFilter_A380PrimComputer_T *localDW);
  static void A380PrimComputer_MATLABFunction_m_Reset(rtDW_MATLABFunction_A380PrimComputer_j_T *localDW);
  static void A380PrimComputer_MATLABFunction_m(boolean_T rtu_u, boolean_T rtu_isRisingEdge, boolean_T *rty_y,
    rtDW_MATLABFunction_A380PrimComputer_j_T *localDW);
  static void A380PrimComputer_MATLABFunction_p_Reset(rtDW_MATLABFunction_A380PrimComputer_k_T *localDW);
  static void A380PrimComputer_MATLABFunction_c(boolean_T rtu_u, real_T rtu_Ts, boolean_T rtu_isRisingEdge, real_T
    rtu_timeDelay, boolean_T *rty_y, rtDW_MATLABFunction_A380PrimComputer_k_T *localDW);
  static void A380PrimComputer_MATLABFunction_j_Reset(rtDW_MATLABFunction_A380PrimComputer_km_T *localDW);
  static void A380PrimComputer_MATLABFunction_j(real_T rtu_u, real_T rtu_highTrigger, real_T rtu_lowTrigger, boolean_T
    *rty_y, rtDW_MATLABFunction_A380PrimComputer_km_T *localDW);
  static void A380PrimComputer_MATLABFunction_ek(boolean_T rtu_bit1, boolean_T rtu_bit2, boolean_T rtu_bit3, boolean_T
    rtu_valid, a380_pitch_efcs_law *rty_law);
  static void A380PrimComputer_GetIASforMach4(real_T rtu_m, real_T rtu_m_t, real_T rtu_v, real_T *rty_v_t);
  static void A380PrimComputer_RateLimiter_e_Reset(rtDW_RateLimiter_A380PrimComputer_b_T *localDW);
  static void A380PrimComputer_RateLimiter_n(real_T rtu_u, real_T rtu_up, real_T rtu_lo, real_T rtu_Ts, boolean_T
    rtu_reset, real_T *rty_Y, rtDW_RateLimiter_A380PrimComputer_b_T *localDW);
  static void A380PrimComputer_MATLABFunction_cw(const boolean_T rtu_u[19], real32_T *rty_y);
  static void A380PrimComputer_MATLABFunction_ei(a380_pitch_efcs_law rtu_law, boolean_T *rty_bit1, boolean_T *rty_bit2,
    boolean_T *rty_bit3);
  static void A380PrimComputer_MATLABFunction2(a380_lateral_efcs_law rtu_law, boolean_T *rty_bit1, boolean_T *rty_bit2);
  A380LateralDirectLaw LawMDLOBJ1;
  A380LateralNormalLaw LawMDLOBJ2;
  A380PitchAlternateLaw LawMDLOBJ3;
  A380PitchDirectLaw LawMDLOBJ4;
  A380PitchNormalLaw LawMDLOBJ5;
};

#endif

