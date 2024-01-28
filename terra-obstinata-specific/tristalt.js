/*	-WHAT IS THIS?-
	The script featured here is made as an optional addition to "MPMB's Character Record Sheet" found at http://flapkan.com/mpmb/dmsguild
	You can add the content to the Character Sheet's functionality by adding the script below in the "Add Custom Script" dialogue.
	-KEEP IN MIND-
	Note that you can add as many custom codes as you want, but you have to add the code in at once (i.e. copy all the code into a single, long file and copy that into the sheet).
	It is recommended to enter the code in a fresh sheet before adding any other information.
*/

/*	-INFORMATION-
	Subject:	Rules Change
	Effect:		This script fundamentally modifies the sheet to accomodate "tristalt" character in the Terra Obstinata campaign setting.
  Tristalt characters are similar to the "gestalt" character rules as defined in 3.5e D&D but are presented as the following:
    Choose three character classes that will be combined to make up your class progression.
    You will have the saving throw and weapon/armor proficiencies as granted by each of your three classes simultaneously.
    You will have access to the class skills of each of your three classes.
    Your Hit Dice and number of skill proficiencies will be determined by whichever class is highest.
    You receive Extra Attack and ASIs from only a single source per level. (For instance, at 4th level, receive one ASI, not three)
    Otherwise, you receive all other class features of all three classes as you progress.
    If you have multiple sources of casting, they will be divorced from one another, meaning you will have separate spells per day progression to cast each class' spells

    Example:
      At character creation you decide to be a sorcerer, bard, and fighter tristalt character at level 1. 
      You will have d10 hit die and proficiency in all armor and weapons and Strength and Constitution saves from the fighter class, 
      You will also get the Dexterity and Charisma save and tool proficiencies from the bard, as well as three skill proficiencies from the fighter, bard, or sorcerer class lists
      Finally, sorcerer already has Constitution and Charisma save proficiencies so you will get no further proficiencies from the sorcerer.
      Finally, all class features including spell slots per day and spells known independently from all three classes.
      
      At level 2, once again they receive the fighter's d10 hit die, all class features, but remember that casting classes have divorced spell progression. For instance, you will have three 1st level spell slots per day from the bard, and the sorcerer each. You will NOT have four 1st level spell slots and three 2nd level spell slots as if you were a 4th level multiclassed character.



  Code by:		George Blanchard
	Code version:	v1
	Date:			2024-01-25 (sheet v13.0.6)

  This version does everything I need EXCEPT it does not yet divorce the casting classes. That will be much more tricky.
*/

var iFileName = "Terra Obstinata tristalt characters";
RequiredSheetVersion("13.0.6");

// Re-define the way the experience points are matched to a level, so that each experience point total is matched to triple the level
ExperiencePointsList = [
  "", "", "", 
  300, 300, 300, 
  900, 900, 900, 
  2700, 2700, 2700, 
  6500, 6500, 6500, 
  14000, 14000, 14000, 
  23000, 23000, 23000, 
  34000, 34000, 34000, 
  48000, 48000, 48000, 
  64000, 64000, 64000, 
  85000, 85000, 85000, 
  100000, 100000, 100000, 
  120000, 120000, 120000, 
  140000, 140000, 140000, 
  165000, 165000, 165000, 
  195000, 195000, 195000, 
  225000, 225000, 225000, 
  265000, 265000, 265000, 
  305000, 305000, 305000, 
  355000, 355000, 355000, 
  1000000000, 1000000000, 1000000000];

// Make it so that the Level field shows only one third the level
tDoc.getField("Character Level").setAction("Format", "event.value = event.value ? Math.floor(event.value/3) : '';");

// Make the proficiency bonus that which it would be for one third the level
// Keeping in mind TO's enhanced progression starting at 4th and every 3 levels 
ProficiencyBonusList = 
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4, 4, 4, 4,
  5, 5, 5, 5, 5, 5, 5, 5, 5,
  6, 6, 6, 6, 6, 6, 6, 6, 6,
  7, 7, 7, 7, 7, 7, 7, 7, 7,
  8, 8, 8, 8, 8, 8
];

//standard proficiency bonus is as follows:
// ProficiencyBonusList = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
//   3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
//   4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
//   5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
//   6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];

// Change the cantrip damage die so that it only goes up at the triple level
cantripDie = [
  1, 1, 1,
  1, 1, 1,
  1, 1, 1,
  1, 1, 1,
  2, 2, 2, 
  2, 2, 2, 
  2, 2, 2, 
  2, 2, 2, 
  2, 2, 2, 
  2, 2, 2, 
  3, 3, 3, 
  3, 3, 3, 
  3, 3, 3, 
  3, 3, 3, 
  3, 3, 3, 
  3, 3, 3, 
  4, 4, 4, 
  4, 4, 4, 
  4, 4, 4, 
  4, 4, 4];


  // adds spell slots from each class together instead of combining caster levels directly.
  // Therefore a Wizard 2 / Cleric 2 will be treated as having three 1st level spell slots per class, which will show up on the sheet as six 1st level slots total.
  // Rather than being treated as a 4th level multi-classes character receiving 2nd level slots that we don't want.
  // Even then, this doesn't quite do what we want (unless you're a DM that's fine with your characters using wizard slots to cast cleric spells and so on)
  // Therefore it's up to 
for (var sClass in ClassList) {
    var spFactor = ClassList[sClass].spellcastingFactor;
    if (spFactor && !isNaN(spFactor)) {
        if (!ClassList[sClass].spellcastingTable) ClassList[sClass].spellcastingTable = defaultSpellTable;
        ClassList[sClass].spellcastingFactor = sClass + spFactor;
    }
}
for (var sSubClass in ClassSubList) {
    var spFactor = ClassSubList[sSubClass].spellcastingFactor;
    if (spFactor && !isNaN(spFactor)) {
        if (!ClassSubList[sSubClass].spellcastingTable) ClassSubList[sSubClass].spellcastingTable = defaultSpellTable;
        ClassSubList[sSubClass].spellcastingFactor = sSubClass + spFactor;
    }
}