//ButtonRNDBrightsignSerialMulti.ino
//is a we the curious interactive button for use with the Brightsign media players using usb serial comunication.
//It is usefull for other exhibits and control due to the basic opto-isolated I/O protocol.

#include <MPR121.h>
#include <Wire.h>
#include <FastLED.h>
#include <avr/wdt.h>
#include <ArduinoJson.h>
DynamicJsonDocument doc(256);

// You can have up to 4 on one i2c bus but one is enough for testing!
MPR121_t cap1 = MPR121_t();
MPR121_t cap2 = MPR121_t();
MPR121_t cap3 = MPR121_t();
MPR121_t cap4 = MPR121_t();

// How many leds in your strip?
#define NUM_LEDS 6

// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806 define both DATA_PIN and CLOCK_PIN
#define DATA_PIN 7

#define switchElectrode 0 //use touch electrode 0

// SERIAL COMMUNICATION VARIABLES
const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

  // variables to hold the parsed data
char state[numChars] = {0};
int channel = 0;


boolean newData = false;


//ACTIONS
const char START_GAME[] = "{\"type\":\"START_GAME\"}";
const char STOP_GAME[] = "{\"type\":\"STOP_GAME\"}";
const char SUCCESS[] = "{\"type\":\"SUCCESS\"}";
const char FAILURE[] = "{\"type\":\"FAILURE\"}";

const long frameRate = 5;
unsigned long previousMillis = 0;
unsigned long currentMillis = 0;
unsigned long totalTime = 2000;        //total time in millis
unsigned long finishMillis = 0;
unsigned long interval = 0;
unsigned long stepsLeftXten = 0;
unsigned long timeLeftMillis = 0;
unsigned long framesLeft = 0;
unsigned long DimValXten =0;
unsigned long totalStepsInSequence = NUM_LEDS * 255 ;
unsigned long startMillis =0;
unsigned long timeNowPoint =0;
unsigned long DimValSteps =0;
unsigned long stepsPerLed =0;
int LedNo1 = 0 ;
int LedNo2 = 0 ;
int LedNo3 = 0 ;
int LedNo4 = 0 ;
int DimVal  = 0 ;
int TimEnbl = 0 ;
int LedNoPrv = 0;
int wDimVal =0;

int LedSt1 = 0;               //led state 0,1,2,3 or 4 
int LedSt2 = 0;
int LedSt3 = 0;
int LedSt4 = 0;

uint8_t gHue = 0; // rotating "base color" used by many of the patterns

// Define the array of leds
CRGB leds1[NUM_LEDS];
CRGB leds2[NUM_LEDS];

//SETUP
void setup() { 
//  wdt_enable(WDTO_8S);      //set watchdog to 8 seconds
//  wdt_reset();
  
  FastLED.addLeds<WS2812, 7, GRB>(leds1, NUM_LEDS);
  FastLED.addLeds<WS2812, 8, GRB>(leds2, NUM_LEDS);
    
  long interval = 1000/frameRate;
  Serial.begin(115200);
  Serial.setTimeout(50);
  Wire.begin();

  // Default address is 0x5A, if tied to 3.3V its 0x5B
  // If tied to SDA its 0x5C and if SCL then 0x5D
  if (!cap1.begin(0x5A)) {
    if (1);
  }
  if (!cap2.begin(0x5B)) {
     if (1);
  }
  if (!cap3.begin(0x5C)) {
    if (1);
  }
  if (!cap4.begin(0x5D)) {
      if (1);
  }
  
  // pin 4 is the MPR121 interrupt on the Bare Touch Board
  cap3.setInterruptPin(4);
  cap4.setInterruptPin(4);
  // this is the touch threshold - setting it low makes it more like a proximity trigger
  // default value is 40 for touch
  cap3.setTouchThreshold(20);
  cap4.setTouchThreshold(20);
  // this is the release threshold - must ALWAYS be smaller than the touch threshold
  // default value is 20 for touch
  cap3.setReleaseThreshold(10);
  cap4.setReleaseThreshold(10);
  // initial data update
  cap3.updateTouchData();
  cap4.updateTouchData();

//SETUP RING
  fill_solid( leds1, NUM_LEDS, CRGB(255,0,0));
  fill_solid( leds2, NUM_LEDS, CRGB(0,255,0));
  FastLED.show();
  delay(250);
  fill_solid( leds1, NUM_LEDS, CRGB(0,255,0));
  fill_solid( leds2, NUM_LEDS, CRGB(0,0,255));
  FastLED.show();
  delay(250);
  fill_solid( leds1, NUM_LEDS, CRGB(0,0,255));
  fill_solid( leds2, NUM_LEDS, CRGB(255,0,0));
  FastLED.show();
  delay(250);
  fill_solid( leds1, NUM_LEDS, CRGB(255,0,0));
  fill_solid( leds2, NUM_LEDS, CRGB(255,0,0));
  FastLED.show();
  delay(250);
}


void loop() { 
  
  // send the 'leds' array out to the actual LED strip
  FastLED.show(); 
  currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {   //frame rate setting
    previousMillis = currentMillis;
  
    if(cap3.touchStatusChanged()){
      cap3.updateTouchData();
    
      if(cap3.isNewTouch(switchElectrode)){
       Serial.println(START_GAME);
      }
      else if(cap3.isNewRelease(switchElectrode)){      
         
      }
    }
  
    if(cap4.touchStatusChanged()){
       cap4.updateTouchData();
       if(cap4.isNewTouch(switchElectrode)){
          Serial.println(STOP_GAME);
       }
       else if(cap4.isNewRelease(switchElectrode)){
          
      }
    }
  }//millis

  recvWithStartEndMarkers();
  if (newData == true) {
      strcpy(tempChars, receivedChars);
          // this temporary copy is necessary to protect the original data
          //   because strtok() used in parseData() replaces the commas with \0
      parseData();
      updateButton();
      newData = false;
  }

}//loop

//============

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void parseData() {      // split the data into its parts

    char * strtokIndx; // this is used by strtok() as an index

    strtokIndx = strtok(tempChars,",");      // get the first part - the string
    strcpy(state, strtokIndx); // copy it to messageFromPC

 
    strtokIndx = strtok(NULL, ","); // this continues where the previous call left off
    channel = atoi(strtokIndx);     // convert this part to an integer



}



void updateButton() {
  //CRGB channel_out[NUM_LEDS];

   
  if (channel == 1){   
      if (state[0] == 'N') {
         fill_solid( leds1, NUM_LEDS, CRGB(0,255,0));   
         Serial.println(SUCCESS);    
      }
      else if (state[0] == 'F'){
         fill_solid( leds1, NUM_LEDS, CRGB(255,0,0));
         Serial.println(SUCCESS);
      } 
        
  }
  else if (channel == 2) {
     if (state[0] == 'N') {
         fill_solid( leds2, NUM_LEDS, CRGB(0,255,0));
         Serial.println(SUCCESS);
      }
      else if (state[0] == 'F'){
         fill_solid( leds2, NUM_LEDS, CRGB(255,0,0));
         Serial.println(SUCCESS);
      } 
  }
}