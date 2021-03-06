/*
 * 
 * The Outlaw's camp
 * 
 */

// Create namespace
world.loc.Outlaws = {
	Camp : new Event("Outlaws' camp"),
	Infirmary : new Event("Infirmary")
}

world.SaveSpots["Outlaws"] = world.loc.Outlaws.Camp;
world.loc.Outlaws.Camp.SaveSpot = "Outlaws";
world.loc.Outlaws.Camp.safe = function() { return true; };
//TODO
world.loc.Outlaws.Camp.description = function() {
	Text.Add("You are in the outlaws' camp.<br/>");
}

world.loc.Outlaws.Camp.onEntry = function() {
	if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry && cveta.flags["Met"] < Cveta.Met.MariaTalk)
		Scenes.Cveta.MariaTalkFirst();		
		/* TODO
		 * #Initiates when Cveta is at 60 rel. (Consider rel requirements for Zenith as well?)
		 * #Triggers when the player enters the outlaw camp in the evening.
		 */
	else if(cveta.Relation() >= 60 && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.Initiated) //TODO
		Scenes.BullTower.Initiation();
	else if(outlaws.AlaricSaved() && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.AlaricFollowup && outlaws.BTRewardTimer.Expired())
		Scenes.BullTower.AftermathAlaric();
	else if(outlaws.BullTowerCanGetReward() && outlaws.flags["BullTower"] < Outlaws.BullTowerQuest.ZenithFollowup && outlaws.BTRewardTimer.Expired())
		Scenes.BullTower.AftermathZenith();
	else
		PrintDefaultOptions();
}

world.loc.Outlaws.Camp.links.push(new Link(
	"Forest", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {hour: 1});
	}
));

world.loc.Outlaws.Camp.links.push(new Link(
	"Infirmary", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Outlaws.Infirmary, {minute: 5});
	}
));

world.loc.Outlaws.Camp.links.push(new Link(
	"Tower", function() {
		return outlaws.flags["BullTower"] == Outlaws.BullTowerQuest.Initiated;
	}, true,
	null,
	function() {
		Scenes.BullTower.MovingOut();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Maria", function() {
		var time = maria.IsAtLocation();
		return time;
	}, true,
	function() {
		//TODO
	},
	function() {
		Scenes.Maria.CampInteract();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Cveta", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.Available;
		var time = cveta.InTent();
		return met && time;
	}, true,
	function() {
		if(cveta.flags["Met"] >= Cveta.Met.FirstMeeting)
			Scenes.Cveta.CampDesc();
	},
	function() {
		Scenes.Cveta.Approach();
	}
));

world.loc.Outlaws.Camp.events.push(new Link(
	"Performance", function() {
		var met  = cveta.flags["Met"] >= Cveta.Met.FirstMeeting;
		var time = cveta.PerformanceTime();
		return met && time;
	}, true,
	null,
	function() {
		Scenes.Cveta.Performance();
	}
));



world.loc.Outlaws.Infirmary.description = function() {
	var parse = {
		
	};
	
	Text.Add("This large tent is what passes for an infirmary in the outlaws’ camp. As soon as you step through the open flaps, three rows of simple wooden cots - no more than tough cloth stretched out on wooden frames - greet your eyes; thankfully, only a few of them are filled at any one time. Further to the back, makeshift workbenches and shelves for storing herbs, minerals and medications; besides that, a burner that works away without rest. You note that ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("it’s currently boiling water in a large tin pot, in which the good surgeon’s scalpel, tweezers and a host of other disturbingly sharp tools are immersed.", parse);
	});
	scenes.AddEnc(function() {
		parse["t"] = party.InParty(terry) ? Text.Parse(", causing Terry to wrinkle [hisher] nose in disgust", { hisher: terry.hisher() }) : "";
		Text.Add("it’s been attached to a flask and a maze of glass tubes, obviously a distillery - spirits go in one end, and purified alcohol comes out the other. The resultant smell that emerges with the steam and fills the air is sharp and harsh[t].", parse);
	});
	scenes.AddEnc(function() {
		Text.Add("the flame has been turned down to slowly warm a crucible filled with fragrant herbs, a pleasant aroma wafting through the air that makes you feel restful and drowsy.", parse);
	});
	scenes.Get();
	
	Text.NL();
	Text.Add("A large, prominently displayed sign declares: <i>“If you’re going to report sick, you’d better damn well be sick.”</i>", parse);
	Text.NL();
	Text.Add("Another corner has been set up with curtains and a large stone table, complete with restraints cobbled together from metal rings and leather straps. Despite the fact that its surface is smooth and great pains have been taken to keep it clean, numerous bloodstains adorn its surface and sides. A number of depressingly grim implements hang from nearby hooks - a large saw, leather strops, what looks like a sharpened butcher’s cleaver…  there’s little doubt that the curtains are there to spare the bedridden the sight of what goes on within by necessity.", parse);
	Text.NL();
	Text.Add("Towards the back, obscured by the shelves and a large bookcase, are Aquilius’ quarters. Although you can’t see them from where you stand, you know they’re as sparse and functional as any of the other outlaws’. A couple of potted, leafy plants have been placed near a window, clearly herbs of some sort; there’s even a damp log on which mushrooms are sprouting in large yellow clumps.", parse);
	Text.NL();
	
	if(world.time.hour >= 7 && world.time.hour < 17)
		Text.Add("Aquilius’ assistants perform the daily grind of seeing to the needs of the injured and bedridden, while the surgeon himself tends to the ignoble task of seeing to those coming in claiming illness or injury.", parse);
	else
		Text.Add("While the surgeon has retired for the night, one of his assistants is still on duty, watching over the infirm by the light of a small, hooded lantern. It’s little wonder that being surgeon for the outlaws is a job that doesn’t guarantee regular rest hours.", parse);
	Text.NL();
	Text.Add("Taking a moment to savor the peace the infirmary affords, you consider what you ought to do next.", parse);
}

world.loc.Outlaws.Infirmary.onEntry = function() {
	if(aquilius.flags["Met"] == 0)
		Scenes.Aquilius.FirstMeeting();
	else
		PrintDefaultOptions();
}

world.loc.Outlaws.Infirmary.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Outlaws.Camp, {minute: 5});
	}
));

world.loc.Outlaws.Infirmary.events.push(new Link(
	"Aquilius", function() {
		return aquilius.IsAtLocation();
	}, true,
	null,
	function() {
		Scenes.Aquilius.Approach();
	}
));
