function Game()
{
	// TODOs from mango...
	/*
	
	

		I mean adding a step. Buying some parts that you then need to work on a bit like not buying bolts but a bolt machine you know
	
		They could send messages in the beginning. Your worm can is no interest to us you pitiful fool
	
	*/
	
	// TODOs from me...
	/*
		I'm using plain js confirm and alert since 8/2017 here. It would be nicer to do that with jquery.
		
		How does pagination on messages work anyway? Textarea? Screen's getting a bit crowded now.
	*/
	
	//Constants
	var FRAMERATE = 20;
	var DISPLAYBARMAXWIDTH = 100;
	var STARTINGCURSORCOST = 10;
	var CURSORCOSTGROWTHRATE = 4;
	var CREDITCOST = 100;
	var NUMBEROFSYSTEMS = 1500;
	var STARTSYSTEM = 1234;
	// var PERSECONDCHANCEOFATTACKINSPACE = .001;

	//Initialised values
	this.planetNameArray = getManySystemNames(NUMBEROFSYSTEMS);
	var currentSystemId = STARTSYSTEM;
	this.driveDestinationID = STARTSYSTEM;
	var cargoList = initialiseCargoList();

	//Properties
	this.energy = 1000; // Set energy to 1000 for testing purposes.
	this.cursorCount = 1;
	this.cursorCost = STARTINGCURSORCOST;
	this.cronVariable = 0;
	this.creditCount = 0;
	this.status = "SPACE";
	
	this.myShip = new ship(10,10,"Unknown","Cricket",1,1,2);
	this.myShip.weapons[0] = new weapon("Laser",5,1,0,0,1,70,0,0);
	this.myShip.weapons[1] = new weapon("Missile",10,3,1,2,1,70,0,0);
	this.myShip.weapons[2] = new weapon("Laser",5,1,0,0,1,70,0,0);

	this.shieldSystem = new shipSystem(this.myShip.shields, FRAMERATE, "divShieldsStatus", "imgShieldsBar", DISPLAYBARMAXWIDTH, false, true);
	this.driveSystem = new shipSystem(10, FRAMERATE, "divDriveStatus", "imgDriveBar", DISPLAYBARMAXWIDTH, false, true);
	this.dockingSystem = new shipSystem(50, FRAMERATE, "divDockingStatus", "imgDockingBar", DISPLAYBARMAXWIDTH, true, true);
	this.hardPoints = [];
	
	this.currentSystem = new starsystem(currentSystemId, this.planetNameArray);
	this.localPlanetMap = [];
	
	this.myMessages = initialiseMessagesList();
	
	
	// UI functions
	this.drawDashboard = function() {
		document.getElementById("divEnergyLevel").innerText = Math.round(this.energy);
		document.getElementById("divCursors").innerText = this.cursorCount;		
		document.getElementById("divCredits").innerText = this.creditCount;
		this.shieldSystem.displayBar();
		this.driveSystem.displayBar();
		this.dockingSystem.displayBar();

		for(i=0;i<this.hardPoints.length;i++)
		{
			if(this.hardPoints[i].enabled == true)
				this.hardPoints[i].displayBar();
		}
	}
	
	this.displayMessage = function(msgNo)
	{
		var outStr = "From : " + this.myMessages[msgNo].sender + "\n\n" +
						"Subject : " + this.myMessages[msgNo].subject + "\n\n" +
						"Message : \n\n" + this.myMessages[msgNo].messagetext;
		alert(outStr);
	}
	
	this.displayMessages = function() 
	{
			var outStr = "<table border=\"1\">\n";
			
			outStr = outStr + "<tr><td><strong>From</strong></td><td><strong>Subject</strong></td></tr>\n";
			
			for(i=0;i<this.myMessages.length;i++)
			{
				outStr = outStr + "<tr>\n";
				outStr = outStr + "<td>" + this.myMessages[i].sender + " " + this.myMessages.length + "</td>\n";
				outStr = outStr + "<td>" + this.myMessages[i].subject + "</td>\n";
				outStr = outStr + "<td><input type=\"button\" value=\"Read\" onclick=\"Game.displayMessage(" + i + ");\"></td>\n";
				outStr = outStr + "<tr>\n";
			}
			
			outStr = outStr + "</table>";
			
			document.getElementById("messagebox").innerHTML=outStr;
	}
	
	this.drawLocalMap = function() 
	{
		if(Game.driveSystem.broken==false)	
		{
			this.localPlanetMap = displayLocalMap(this.planetNameArray, NUMBEROFSYSTEMS, currentSystemId);
			document.getElementById("divCurrentSystem").innerText = Game.planetNameArray[currentSystemId];
		}
	}
	
	this.installWeapons = function() 
	{
			Game.hardPoints = [];
			
			for(i=0;i < Game.myShip.weapons.length;i++)
			{
				this.hardPoints[i] = new shipSystem((Game.myShip.weapons[i].cooldown*10), FRAMERATE, ("divHardpointStatus" + (i+1)), ("imgHardpointBar" + (i+1)), DISPLAYBARMAXWIDTH, false, true);
			}
			for(j=i;j<6;j++)
			{
				this.hardPoints[j] = new shipSystem(1, FRAMERATE, "", "", DISPLAYBARMAXWIDTH, false, false);
			}
	}
	
	this.drawWeapons = function() 
	{
		letters = ['A','B','C','D','E','F'];
		
		for(i=0;i<Game.hardPoints.length;i++)
		{
			if(Game.hardPoints[i].enabled == true)
			{
				document.getElementById("divHardPoint" + (i+1)).innerText = this.myShip.weapons[i].name;
				document.getElementById("cmdHardpoint" + (i+1)).value = "HARDPOINT " + letters[i];
				document.getElementById("cmdHardpoint" + (i+1)).onclick = new Function("Game.energy = Game.hardPoints[" + i + "].toggle(Game.energy);");
			}
			else
			{
				document.getElementById("divHardPoint" + (i+1)).innerText = "Not Installed";
				document.getElementById("cmdHardpoint" + (i+1)).value = "<disabled>";
				document.getElementById("cmdHardpoint" + (i+1)).onclick = "x";
			}
		}
	}
	
	// Cron functions
	this.cron_start = function() 
	{
		this.cronVariable = setInterval(this.cron_tick,(1000/FRAMERATE));
	}
	
	this.cron_stop = function() 
	{
		clearInterval(this.cronVariable);
	}
	
	this.cron_tick = function() 
	{
		Game.handleFramedClick();
		Game.handleEnemySpawns();
		Game.handleCombat()
	} 

	// Handlers for combat
	this.handleEnemySpawns = function()
	{
		
	}
	
	this.handleCombat = function()
	{
		
	}
	
	// Click Handlers
	this.handleFramedClick = function() 
	{		
		this.energy += (this.cursorCount / FRAMERATE);
		
		this.energy = this.shieldSystem.tick(this.energy);
		this.energy = this.driveSystem.tick(this.energy);
		this.energy = this.dockingSystem.tick(this.energy);
		
		for(i=0;i<this.hardPoints.length;i++)
		{
			if(this.hardPoints[i].enabled==true)
			{
				this.energy = this.hardPoints[i].tick(this.energy);
			}
		}
		
		this.drawDashboard();
	}
	
	this.handleClick = function() 
	{
		this.energy++;
		this.drawDashboard();
	}
	
	this.buyUpgrade = function() 
	{
		if(this.energy >= this.cursorCost)
		{
			this.energy -= this.cursorCost;
			this.cursorCost = this.cursorCost * CURSORCOSTGROWTHRATE;
			this.cursorCount++;
			document.getElementById("cmdUpgrade").value = "UPGRADE (cost " + this.cursorCost + ")";
			this.drawDashboard();
		}
	}
	
	this.buyCredit = function(amount) 
	{
		if(this.energy >= (CREDITCOST * amount))
		{
			this.energy -= (CREDITCOST * amount);
			this.creditCount += amount;
		}
		
		this.drawDashboard();
	}
	
	this.handleLocalMapClick = function(evt) {
		
			var rect = document.getElementById("localCanvas").getBoundingClientRect();
			var x = evt.clientX - rect.left;
			var y = evt.clientY - rect.top;

			for(i=0;i<Game.localPlanetMap.length;i++)
			{
				if(((x > Game.localPlanetMap[i][0]-5) && (x < Game.localPlanetMap[i][0]+5)) &&
					((y > Game.localPlanetMap[i][1]-5) && (y < Game.localPlanetMap[i][1]+5)))
				{
					document.getElementById("divDriveDest").innerText = Game.planetNameArray[Game.localPlanetMap[i][2]];
					Game.driveDestinationID = Game.localPlanetMap[i][2];
				}
			}
	}

	this.handleJumpClick = function() {
		if(this.driveSystem.systemPointsCurrent == this.driveSystem.systemPointsMax &&
			currentSystemId != Game.driveDestinationID)
		{
			this.driveSystem.systemPointsCurrent = 0;
			this.driveSystem.framesUntilPointCurrent = 0;
			
			currentSystemId = Game.driveDestinationID;
			Game.drawLocalMap();
			document.getElementById("divCurrentSystem").innerText = Game.planetNameArray[currentSystemId];
			document.getElementById("divDriveDest").innerText = Game.planetNameArray[Game.driveDestinationID];
		}
	}
}

// **********************************************************************************
// Helper Functions

function prettyPrintBool(boolVal) {
	if(boolVal==true)
		return "ON";
	else
		return "OFF";
}


// **********************************************************************************
// Ship Entities

function message(sender, subject, messagetext) {
	
	this.sender = sender;
	this.subject = subject;
	this.messagetext = messagetext;
}

function ship(hullpoints,shieldpoints,vesselname,vesselclass,
		hardpoints,crewspaces,cargobaysize) {
			
	// Properties

	this.hull = hullpoints;
	this.shields = shieldpoints;
	this.name = vesselname;
	this.vesselclass = vesselclass;
	this.destroyed = 0;
	this.derelict = 0;
	this.hardpoints = hardpoints;
	this.weapons = [this.hardpoints];
	this.crewspaces = crewspaces;
	this.crew = [this.crewspaces];
	this.punctured = 0;
	this.burning = 0;
	this.cargobay = new cargobay(cargobaysize);

	// Methods

	this.takeDamage = function(dmg) 
	{
		if(this.shields>=dmg)
		{
			this.shields = this.shields - dmg;
		}
		else
		{
			dmg = dmg - this.shields;
			this.shields = 0;

			if(this.hull>dmg)
			{
				this.hull = this.hull - dmg;
			}
			else
			{
				this.hull = 0;
				this.destroyed = 1;
			}
		}
	}

	this.updateCooldowns = function()
	{
		for(i=0;i<this.hardpoints;i++)
		{
			if(this.weapons[i].cooldownticksremaining>0)
			{
				this.weapons[i].cooldownticksremaining--;
			}
		}
	}

	this.getRandomLivingCrewmember = function()
	{
		var deadCrew = Math.floor(Math.random() * 
				this.crewspaces);

		while(this.crew[deadCrew].dead==1)
		{
			deadCrew = Math.floor(Math.random() * 
					this.crewspaces);
		}

		return deadCrew;
	}

	this.checkDerelict = function()
	{	
		var crewDead = 0;
		var crewLiving = 0;

		for(i=0;i<this.crewspaces;i++)
		{
			if(this.crew[i].dead==1)
				crewDead++;
			else
				crewLiving++;
		}

		if(crewLiving==0)
			this.derelict = 1;
	}

	this.getFullShipName = function()
	{
		return "\"" + this.vesselclass + "\"-class vessel " +
			"\"" + this.name + "\"";
	}

	this.handleBurning = function()
	{
		var outMsg = "";

		if(this.burning == 1)
		{
			outMsg = outMsg + "\"" + this.name + "\" suffers " +
					BURNDAMAGE + " points of fire damage!\n";
			this.takeDamage(BURNDAMAGE);

			var rand = Math.floor(Math.random()*100)+1;
		
			if(rand < BURNTODEATHCHANCE)
			{
				var deadCrew = this.getRandomLivingCrewmember();

				outMsg = outMsg + "Crewmember " + 
						this.crew[deadCrew].name + " " +
						"burns to death!";

				this.crew[deadCrew].dead=1;	
			}
		}

		return outMsg;
	}

	this.handlePunctured = function()
	{
		var outMsg = "";

		if(this.punctured == 1)
		{
			var rand = Math.floor(Math.random()*100+1);

			if(rand < SUCKEDINTOSPACECHANCE)
			{
				var deadCrew = this.getRandomLivingCrewmember();

				outMsg = outMsg + "Crewmember " + 
							this.crew[deadCrew].name + " " +
							"is sucked out of the hole in the " +
							"ship!\n";

				this.crew[deadCrew].dead=1;
			}
		}

		return outMsg;
	}

	this.generateRandomShip = function()
	{
		var rndShip = Math.floor(Math.random() * 
				shipsList.length);

		var outShip = new ship(shipsList[rndShip].hull,
					shipsList[rndShip].shields,
					shipsList[rndShip].name,
					shipsList[rndShip].vesselclass,
					shipsList[rndShip].hardpoints,
					shipsList[rndShip].crewspaces,
					shipsList[rndShip].cargobay.size);

		for(i=0;i<outShip.hardpoints;i++)
		{
			var rndWpn = Math.floor(Math.random() * 
				weaponsList.length);

			outShip.weapons[i] = new weapon(weaponsList[rndWpn].name,
							weaponsList[rndWpn].maxdamage,
							weaponsList[rndWpn].mindamage,
							weaponsList[rndWpn].usesammo,
							2,
							weaponsList[rndWpn].cooldown,
							weaponsList[rndWpn].chancetohit,
							weaponsList[rndWpn].chancetopuncture,
							weaponsList[rndWpn].chancetoburn);
		}

		for(i=0;i<outShip.crewspaces;i++)
		{
			outShip.crew[i] = new crewmember("","Human");
			outShip.crew[i].name = outShip.crew[i].generateRandomName();
		}

		var rndCargo = Math.floor(Math.random() *
				outShip.cargobay.size);
		
		for(i=0;i<rndCargo;i++)
		{
			var cargoType = Math.floor(Math.random() *
						cargoList.length);

			outShip.cargobay.addCargo(cargoType,1);
		}

		return outShip;
	}
}

function shipSystem(systemPoints, frameRate, statusElement, barElement, barMaxWidth, zeroIfUnpowered, enabled) {
	this.systemPointsMax = systemPoints;
	this.systemPointsCurrent = 0;
	this.costPerFrame = 1;
	this.framesUntilPointMax = frameRate;
	this.framesUntilPointCurrent = 0;
	this.status = false;
	this.enabled = enabled;
	this.barElement = barElement;
	this.broken = true;
	
	this.toggle = function(energy) 
	{
		
		if(!this.broken)
		{
			this.status = !this.status;
		}
		else
		{
			if(confirm("Pay 400 to fix?"))
			{
				energy = energy - 400;
				this.broken = false;
				Game.drawLocalMap();
			}
		}
		
		document.getElementById(statusElement).innerText = prettyPrintBool(this.status);
		
		if(zeroIfUnpowered)	
		{
			this.systemPointsCurrent = 0;
			this.displayBar();
		}
		
		return energy;
	}
	
	this.tick = function(energy) {
		if(this.status == true)
		{
			if(energy >= this.costPerFrame)
			{
				energy-=this.costPerFrame;
				this.framesUntilPointCurrent++;
				
				if(this.framesUntilPointCurrent == this.framesUntilPointMax)
				{
					this.systemPointsCurrent++;
					this.framesUntilPointCurrent = 0;
					
					if(this.systemPointsCurrent > this.systemPointsMax)
					{
						this.systemPointsCurrent = this.systemPointsMax;
					}
				}
			}
			else
			{
				this.toggle();
			}
		}
		
		return energy;
	}

	this.displayBar = function() {
		var percentFull = (barMaxWidth/this.systemPointsMax) * this.systemPointsCurrent;
		var colorBar = "img/pixel_g.png";
		
		if(percentFull < 66)
			colorBar = "img/pixel_y.png";
		
		if(percentFull < 33)
			colorBar = "img/pixel_r.png";
			
		document.getElementById(barElement).width = percentFull;
		document.getElementById(barElement).src = colorBar;
		
		if(!this.broken)
		{
			document.getElementById(statusElement).innerText = prettyPrintBool(this.status) + "(" + percentFull +"%)";
		}
		else
		{
			document.getElementById(statusElement).innerText = "BROKEN";
		}
	}
}
	
function cargobay(size) {
	this.size=size;
	this.contents = [size];

	for(i = 0; i < size; i++)
		this.contents[i] = new cargoitem(-1,0);

	this.getEmptySpace = function()
	{
		var freeSpace = this.size;

		for(i=0;i<this.size;i++)
		{
			freeSpace = freeSpace - this.contents[i].quantity;
		}

		return freeSpace;
	}

	this.getQtyById = function(cargoType)
	{
		qty = -1;

		for(i=0;i<this.size;i++)
		{
			if(this.contents[i].id==cargoType)
				qty = this.contents[i].quantity;
		}

		return qty;
	}

	this.addCargo = function(cargoType,quantity)
	{
		quantity = parseInt(quantity);

		found = -1;

		for(i=0;i<this.size;i++)
		{
			if(this.contents[i].id==cargoType)
			{
				this.contents[i].quantity = this.contents[i].quantity +
								quantity;
			
				found = 1;
			}
		}

		if(found == -1)
		{
			for(i=0;i<this.size;i++)
			{
				if(this.contents[i].id==-1)
				{
					this.contents[i] = new cargoitem(cargoType,
									quantity);
					break;
				}
			}
		}
	}

	this.removeCargo = function(cargoType,quantity)
	{
		quantity = parseInt(quantity);

		for(i=0;i<this.size;i++)
		{
			if(this.contents[i].id==cargoType)
			{
				if(this.contents[i].quantity>quantity)
				{
					this.contents[i].quantity = this.contents[i].quantity -
									quantity;
				}
				else
				{
					this.contents[i].quantity = 0;
					this.contents[i].id = -1;
				}
			}
		}		
	}
}
	
function cargoitem(cargoType,quantity) {
	this.id = cargoType;

	if(this.id!=-1)
	{
		this.name = cargoList[cargoType];
	}

	this.quantity = quantity;
}

function weapon(weaponName,damageMax,damageMin,usesAmmo,
		currentAmmo,cooldown,chanceToHit,
		chanceToPuncture, chanceToBurn) {
	// Properties

	this.name = weaponName;
	this.maxdamage = damageMax;
	this.mindamage = damageMin;
	this.usesammo = usesAmmo;
	this.cooldown = cooldown;
	this.cooldownticksremaining = 0;
	this.currentammo = currentAmmo;
	this.chancetohit = chanceToHit;
	this.chancetopuncture = chanceToPuncture;
	this.chancetoburn = chanceToBurn;

	// Methods

	this.calculateDamage = function()
	{
		var damage = 0;

		damage = Math.floor(Math.random() * 
				(damageMax - damageMin + 1)
				+(damageMin));

		return damage; 
	}

	this.fire = function()
	{
		var dmg = 0;
		var burning = 0;
		var punctured = 0;

		var randResult = Math.floor(Math.random() * 100) + 1;

		if((this.usesammo==1) && (this.currentammo>0))
			this.currentammo--;
		else if((this.usesammo==1) && (this.currentammo==0))
			dmg = -1;

		if((randResult < this.chancetohit)&&(dmg!=-1))
		{
			dmg = this.calculateDamage();
		}
		else
		{
			dmg = 0; // Damage 0 is a miss.
		}

		var randResult = Math.floor(Math.random() * 100) + 1;
		if(randResult < this.chancetopuncture)
			punctured = 1;

		var randResult = Math.floor(Math.random() * 100) + 1;
		if(randResult < this.chancetoburn)
			burning = 1;

		this.cooldownticksremaining = this.cooldown;

		return {damage: dmg, punctured: punctured, burning: burning};
	}
}
	
	
// **********************************************************************************
// Procedural Planet Functions

function nameSystem(randomNumber) {	
	var myName = "";
	var startSyllables = ["ro","ta","har","xy","yin","fi","la","di","pi","or","yr","ha","qua","ra","tch","f","b","s"];
	var middleSyllables = ["o","i","a","u","o","ja","ma","bu","qua","el","re","qi"];
	var middleSyllablesB = ["ud","um","ig","il","es","is","ay"];
	var endSyllables = ["th","es","sc","k","na","dy","ug","ten","w","s","rag","rn","ts",
						"o","sch","fil","dja","kil","hop","tep"];

		var x = (randomNumber % 6) + 1;	

		if(x==1)
		{
			randomNumber = randomNumber + Math.floor(Math.sin(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						endSyllables[Math.floor(randomNumber % endSyllables.length)]; 
		}
		else if(x==2)
		{
			randomNumber = randomNumber + Math.floor(Math.sqrt(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						middleSyllables[Math.floor(randomNumber % middleSyllables.length)] +
						endSyllables[Math.floor(randomNumber % endSyllables.length)];
		}
		else if(x==3)
		{
			randomNumber = randomNumber + Math.floor(Math.cos(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						middleSyllables[Math.floor(randomNumber % middleSyllables.length)] +
					middleSyllablesB[Math.floor((randomNumber+1) % middleSyllablesB.length)] +
						endSyllables[Math.floor((randomNumber+2) % endSyllables.length)];
		}
		else if(x==4)
		{
			randomNumber = randomNumber + Math.floor(Math.cos(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						middleSyllables[Math.floor(randomNumber % middleSyllables.length)] +
						middleSyllables[Math.floor((randomNumber+2) % middleSyllables.length)] +
						middleSyllables[Math.floor((randomNumber+4) % middleSyllables.length)] +
						endSyllables[Math.floor((randomNumber+6) % endSyllables.length)];
		}
		else if(x==5)
		{
			randomNumber = randomNumber + Math.floor(Math.sin(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						middleSyllablesB[Math.floor(randomNumber % middleSyllablesB.length)] +
						middleSyllablesB[Math.floor((randomNumber+2) % middleSyllablesB.length)] +
						endSyllables[Math.floor((randomNumber+6) % endSyllables.length)];
		}
		else if(x==6)
		{
			randomNumber = randomNumber + Math.floor(Math.sqrt(randomNumber));
			myName = startSyllables[Math.floor(randomNumber % startSyllables.length)] +
						middleSyllablesB[Math.floor(randomNumber % middleSyllablesB.length)] +
						endSyllables[Math.floor(randomNumber % endSyllables.length)];
		}
	
	myName = myName.substring(0,1).toUpperCase() + myName.substring(1,myName.length);

	return myName;
}

function getManySystemNames(target) {
	var arr = [];
	 
	var placed = 0;
	var found = 0;
	var tempName = "";
	
	for(i = 0;i<10000;i++)
	{
		tempName = nameSystem(i);
			
		for(j = 0;j<placed;j++)
		{
			if(arr[j]==tempName)
			{
				found = 1;				
				break;
			}
		}
	
		if(found == 0)
		{
			arr[placed] = tempName;
			placed++;
		}
	
		found = 0;
		
		if(placed==target)
			break;
	}

	return arr;
}
	
function starsystem(idNumber, planetNameArray) {
	this.id = idNumber;
	this.name = planetNameArray[idNumber];
	this.stockmarketprices = [];
	this.xpos = 0;
	this.ypos = 0;
	this.flavourText = "";
	this.color = 0;

	// Figure galactic co-ordinates
	var x = (idNumber % 4) + 1;
	var i = 0;
	var j = 0;

	if(x==0) 
	{
		i = 200; j = 200;
	}
	else if(x==1) 
	{
		i = 200; j = 0;
	}
	else if(x==2) 
	{
		i=0; j=200;
	}
	else if(x==3)
	{
		i = 0; j = 0;
	}

	i = i + Math.floor(parseInt(Math.sin(idNumber).toString().substring(6,9))/2);
	j = j + Math.floor(parseInt(Math.cos(idNumber).toString().substring(6,9))/2);

	while(i > 400)
		i = i - idNumber;

	if(i<0) i = idNumber;

	while(j > 400)
		j = j - idNumber;

	if(j<0) j=idNumber;

	this.xpos = i;
	this.ypos = j;

	var x =  Math.sin(idNumber);

	var x = x.toString();

	var races = ["Humans","Krayce","Tarn","Teth","Eyclasa","Irif","humanoid life forms","Anfar","Girrians","insectoid life forms"];
	var artifactOwners = ["the Seeders","the Builders","an unknown, ancient race"];
	var descriptor = ["arid","damp","humid","desert","jungle","frozen","savannah","rocky","underwater","forest"];
	var systemTypes = ["red giant","yellow star","blue star","white dwarf","brown dwarf"];

	if(idNumber%2==0)
	{
		var flavourText = "The " + this.name + " system consists of " +
							parseInt(Math.floor(parseInt(x.substring(3,4))/2)+1) + " planets, orbitting a " +
							systemTypes[parseInt(Math.floor(x.substring(4,5))/2)] + ". " +
							"The system's most inhabited planet is " + descriptor[parseInt(x.substring(5,6))] + ", " +
							"and is mostly inhabited by " + races[parseInt(x.substring(6,7))] + ".";
	}
	else if(idNumber%2==1)
	{
		var flavourText = this.name + " is a  " + systemTypes[parseInt(Math.floor(x.substring(4,5))/2)] + " system, home to " +
							Math.floor(parseInt(x.substring(3,4))) + " million " +
							races[parseInt(x.substring(6,7))] + ".";
							
	}

	var planetColor = parseInt(Math.floor(x.substring(4,5))/2);

	this.flavourText = flavourText;
	this.color = planetColor;

	this.generateStockMarket = function(cargoList)
	{
		this.stockmarketprices = [cargoList.length];
		
		// Figure Stockmarket - NEEDS REWORKING
		for(i=0;i<cargoList.length;i++)
		{
			// Price should be base +/- 10%, which we'll
			// calculate as 80% + a random number 1% - 20%.
			var outPrice = cargoList[i].baseprice * 0.8;
			var rndFactor = Math.floor(Math.random() *
					(cargoList[i].baseprice * 0.2));
			outPrice = outPrice + rndFactor;

			var quantity = Math.floor(Math.random() * 20);

			this.stockmarketprices[i] = new stockline(outPrice, quantity);
		}
	}
	
	this.getCargoQtyById = function(cargoType)
	{
		qty = -1;

		for(i=0;i<this.stockmarketprices.length;i++)
		{
			if(this.stockmarketprices[i].quantity>0)
				qty = this.stockmarketprices[i].quantity;
		}

		return qty;
	}

	this.removeCargo = function(cargoType,quantity)
	{
		for(i=0;i<cargoList.length;i++)
		{
			if(i==cargoType)
			{
				if(this.stockmarketprices[i].quantity>quantity)
				{
					this.stockmarketprices[i].quantity = 
						this.stockmarketprices[i].quantity -
						quantity;
				}
				else
				{
					this.stockmarketprices[i].quantity = 0;
				}
			}
		}		
	}

	this.getSystemsInRange = function(distance)
	{
		// TODO - Possibly we don't need this function - we're only using this sort of functionality once, and it's not using this
		var systems = [];
		var sysCount = 0;

		for(i=0;i<NUMBEROFSYSTEMS;i++)
		{
			var tempSystem = new starsystem(i);

			if(!isNaN(tempSystem.xpos))
			{
				var distanceFromCurrent = Math.sqrt(
					(Math.abs(this.xpos - tempSystem.xpos)^2) +
					(Math.abs(this.ypos - tempSystem.ypos)^2));

				if(distanceFromCurrent <= distance)
				{
					systems[sysCount] = new systemsList(i,distanceFromCurrent);
					sysCount++;					
				}
			}
		}

		systems.sort(function(a,b){ return a.distance - b.distance; });
		return systems;			
	}

	this.getDistance = function(id)
	{
		var tempSystem = new starsystem(id, planetNameArray);

		var distance = Math.sqrt(
				(Math.abs(this.xpos - tempSystem.xpos)^2) +
				(Math.abs(this.ypos - tempSystem.ypos)^2));

		return distance;
	}
}

function systemsList (id,dist) {
	this.id = id;
	this.distance = dist;
}

function stockline (pr,qu) {
	this.price = pr;
	this.quantity = qu;
}

function displayLocalMap(planetNameArray, numberOfSystems, currentPlanet) 
{

	//TODO - this is full of magic numbers. Can we not do something better with styles here?
	
	var localCanvas = document.getElementById("localCanvas");
	var localCanvasWidth = localCanvas.width;
	var localCanvasHeight = localCanvas.height;
	var localCtx = localCanvas.getContext("2d");

	localCtx.fillStyle = "#AAAAAA";
	localCtx.beginPath();
	localCtx.rect(0,0,localCanvas.width,localCanvas.height);
	localCtx.fill();
			
	localCtx.fillStyle = "#000000";
	localCtx.beginPath();
	localCtx.arc(100,100,100,0,2*Math.PI);
	localCtx.fill();
	
	var localPlanets = [];
	var planetCount = 0;
	
	var currentSystem = new starsystem(currentPlanet,planetNameArray);
	
	for(i=0;i<numberOfSystems;i++)
	{
		var thisSystem = new starsystem(i,planetNameArray);
		
		var distanceFromCurrent = currentSystem.getDistance(i);

		var RANGE = 5;
		
		if(distanceFromCurrent <= RANGE)
		{
			var ZOOM = RANGE + 1;
			var plotX =  (thisSystem.xpos*ZOOM) - (currentSystem.xpos*ZOOM) + (localCanvasWidth/2);
			var plotY =  (thisSystem.ypos*ZOOM) - (currentSystem.ypos*ZOOM) + (localCanvasHeight/2);
			
			localCtx.fillStyle = "#FFFFFF";
			localCtx.beginPath();
			localCtx.arc(plotX, plotY, 4, 0, 2 * Math.PI);
			localCtx.fill();

			localCtx.fillStyle = "#00FFFF";
			localCtx.font="10px Arial";
			localCtx.fillText(planetNameArray[i], (plotX - ((planetNameArray[i].length * 10)/4)),
													(plotY + 15));

			localPlanets[planetCount] = [parseInt(plotX),parseInt(plotY),parseInt(i)];
			planetCount++;
		}						
	}

	localCanvas.addEventListener('click', Game.handleLocalMapClick);

	return localPlanets;
}


// **********************************************************************************
// Initialisation Functions

function initialiseCargoList() 
{
	var cargoList = [{name:"Food", baseprice:10}, 
				{name:"Furs", baseprice:30},
				{name:"Metals", baseprice:150},
				{name:"Electronics", baseprice:600},
				{name:"Liquids", baseprice:50},
				{name:"Exotics", baseprice:1000},
				{name:"Artifacts", baseprice:10},
				{name:"Ceramics", baseprice:100},
				{name:"Gems", baseprice:2000},
				{name:"Drugs", baseprice:3000},
				{name:"Computers", baseprice:200},
				{name:"Plastics", baseprice:150},
				{name:"Art", baseprice:300},
				{name:"Machines", baseprice:500}
	];

	return cargoList;
}

function initialiseWeaponsList() 
{
	// weaponName,damageMax,damageMin,usesAmmo,
	// currentAmmo,cooldown,chanceToHit,
	// chanceToPuncture, chanceToBurn

	var weaponList=[
		new weapon("Laser I",5,1,0,0,1,80,0,0),
		new weapon("Laser II",8,3,0,0,1,80,0,0),
		new weapon("Missile I",10,3,1,2,1,80,0,0),
		new weapon("Mass Driver",5,1,0,0,1,80,20,0),
		new weapon("Singularity Cannon",8,3,0,0,1,80,0,20)
		];

	return weaponList;
}

function initialiseMessagesList() 
{
	// sender, subject, bodytext
	var messageList=[
		new message("Qwerty","Confused? I Would Be", 
						"So hi boss! I'm QWERTY - your shipboard computer. You may be experiencing some " +
						"confusion right now because you've just woken up from cryosleep. There's been an " +
						"accident and it's caused some cerebral degradation - in short you've lost your " +
						"memory. We're going to need to work together in order to get you to safety. You " +
						"should start by cranking the reactor - the ship needs energy to get it going and " +
						"then we'll get on to fixing what's broke!")
	];
	
	return messageList;
}