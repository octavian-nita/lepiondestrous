/*jshint -W097 */
'use strict';

define({
         gameSize: 14,

         board: {
           maxHeight: 695,
           maxWidth: 504
         },

         toastEaseDelay: 3000, // ms
         toastDelay: 750,      // ms

         theme: {
           boardDark: '#795548',
           boardLight: '#8d6e63',

           holeDark: '#3e2723',
           holeLight: '#5d4037',

           pawnDark: '#d32f2f',
           pawnDarkTransparent: 'rgba(211, 47, 47, 0.6)',
           pawnLight: 'white',
           pawnLightTransparent: 'rgba(256, 256, 256, 0.6)',

           shadow: { offsetX: 0, offsetY: 5, blur: 20, color: 'rgba(0, 0, 0, 0.9)' },

           fontFamily: '"Chantelli Antiqua"',
           foreground: '#ffb300'
         }
       });
