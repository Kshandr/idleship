// **********************************************************************************
// EventManagement Functions

function eventManager(gameRef)
{
	// Define some constants here. There might be a better place for them...
	var FIRST_TARGET_ENERGY_REQ = 100;
	
	if((gameRef.goalStatus & 1) == 0)
	{
		gameRef.myMessages.push (new message("QWERTY","Confused? I Would Be", 
						"So hi boss! I'm QWERTY - your shipboard computer. You may be experiencing some " +
						"confusion right now because you've just woken up from cryosleep. There's been an " +
						"accident and it's caused some cerebral degradation - in short you've lost your " +
						"memory. We're going to need to work together in order to get you to safety. You " +
						"should start by cranking the reactor - the ship needs energy to get it going and " +
						"then we'll get on to fixing what's broke!"));
		gameRef.displayMessages();
		gameRef.goalStatus = gameRef.goalStatus + 1;
	}
	
	if(gameRef.energy >= FIRST_TARGET_ENERGY_REQ && ((gameRef.goalStatus & 2) == 0))
	{
		gameRef.myMessages.push ( new message("QWERTY","We've Got The Power!",
						"Great stuff - we've got the reactor going and that'll give us some energy to " +
						"do things with. Firstly, you can have the reactor tick along by itself... if " +
						"you upgrade it it'll generate energy by itself a little faster for each upgrade. " +
						"Of course you can spend your time cranking it by yourself, but you might go " +
						"blind if you do that too much, boss! You can use the reactor to make energy " +
						"credits - that's what we use for currency in the civilised galaxy. But you'll " +
						"want to think about repairing some of the ship's systems so we can do stuff " +
						"other than sit here. Those repairs are going to cost you 400 energy each. Try " +
						"fixing the shields first - this star system's fairly safe but not everywhere " +
						"will be! After that, we're never going to get anywhere if we don't fix the " +
						"Jump Drive..."));
		gameRef.displayMessages();
		gameRef.goalStatus = gameRef.goalStatus + 2;
	}
	
	// Open up UI elements. Done separately to the mail messages because we want to have a "bypass story" 
	// button, and this stuff should be able to be triggered separately to the messages.
	
	if((gameRef.goalStatus & 2) == 2)
	{
		document.getElementById("cmdUpgrade").style.display = "block";
		document.getElementById("cmdBuyCredit").style.display = "block";		
	}
	
	if((gameRef.goalStatus & 16) == 16)
	{
		document.getElementById("hardpointtitle").innerHTML = "<strong>Hardpoint</strong>";
		document.getElementById("systemtitle").innerHTML = "<strong>System</strong>";
		
		for(i=0; i < gameRef.hardPoints.length; i++)
		{
			gameRef.hardPoints[i].visible = true;
			document.getElementById("cmdHardpoint" + (i+1)).style.display = "block";
		}
		
		gameRef.drawWeapons();
	}
}