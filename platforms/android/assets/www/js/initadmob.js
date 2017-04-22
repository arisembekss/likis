// select the right Ad Id according to platform
  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'test', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'test'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: '', // or DFP format "/6253334/dfp_example_ad"
      interstitial: ''
    };
  } else { // for windows phone
    admobid = {
      banner: '', // or DFP format "/6253334/dfp_example_ad"
      interstitial: ''
    };
  }
