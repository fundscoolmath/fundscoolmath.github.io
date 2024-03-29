//time dimensions

function getBreakEternityTDMult(tier){
	let ret = tmp.it
	if (hasTimeStudy(11) && tier == 1) ret = ret.times(tsMults[11]())
	if (qu_save.breakEternity.upgrades.includes(1) && tier < 5) ret = ret.times(getBreakUpgMult(1))
	if (qu_save.breakEternity.upgrades.includes(4) && tier > 3 && tier < 7) ret = ret.times(getBreakUpgMult(4))
	if (tier == 6 && player.ghostify.ghostlyPhotons.unl) ret = ret.times(tmp.le[6])
	if (tier == 8 && hasAch("ng3p62")) ret = ret.pow(Math.log10(player.ghostify.time/10+1)/100+1)
	if (ret.lt(0)) ret = E(0)
	return dilates(ret)
}

function doNGMatLeast4TDChanges(tier, ret){
	//Tickspeed multiplier boost
	let x = (inNGM(5)) ? (hasPU(11) ? puMults[22] : E(1)) : player.postC3Reward
	let exp = ([5, 3, 2, 1.5, 1, .5, 1/3, 0])[tier - 1]
	if (x.gt(1e10)) x = Decimal.pow(10, Math.sqrt(x.log10() * 5 + 50))
	if (hasGalUpg(25)) exp *= galMults.u25()
	if (player.pSac!=undefined) exp /= 2
	if (inNC(16)) exp /= 2
	ret = ret.times(x.pow(exp))

	//NG-4 upgrades
	if (hasGalUpg(12)) ret = ret.times(galMults.u12())
	if (hasGalUpg(13) && player.currentChallenge!="postngm3_4") ret = ret.times(galMults.u13())
	if (hasGalUpg(15)) ret = ret.times(galMults.u15())
	if (inNGM(5) && tier == 2) ret = ret.pow(puMults[13](hasPU(13, true))) //NG-5, not NG-4.
	if (hasGalUpg(44) && inNGM(4)) {
		let e = hasGalUpg(46) ? galMults["u46"]() : 1
		ret = ret.times(Decimal.pow(player[TIER_NAMES[tier]+"Amount"].plus(10).log10(), e * Math.pow(11 - tier, 2)))
	}
	if (hasGalUpg(31)) ret = ret.pow(galMults.u31())
	return ret
}

function getERTDAchMults(){
	if (!player.boughtDims) return 1
	if (hasAch('r117')) {
		return 1 + Math.pow(Math.log(player.eternities), 1.5) / Math.log(100);
	} else if (hasAch('r102')) {
		return 1 + Math.log(player.eternities) / Math.log(100);
	}
	return 1
}

function calcNGM2atleastTDPreVPostDilMultiplier(tier){
	let ret2 = E(1)
	if (player.currentEternityChall == "eterc9") ret2 = ret2.times(tmp.infPow)
	if (ECComps("eterc1") !== 0) ret2 = ret2.times(getECReward(1))
	if (ETER_UPGS.has(4)) ret2 = ret2.times(ETER_UPGS[4].mult())
	if (ETER_UPGS.has(5)) ret2 = ret2.times(ETER_UPGS[5].mult())
	if (ETER_UPGS.has(6)) ret2 = ret2.times(ETER_UPGS[6].mult())
	return ret2
}

function calcVanillaTSTDMult(tier){
	let ret = E(1)
	if (hasTimeStudy(73) && tier == 3) ret = ret.times(tmp.sacPow.pow(0.005).min(E("1e1300")))
	if (hasTimeStudy(93)) ret = ret.times(Decimal.pow(player.totalTickGained, 0.25).max(1))
	if (hasTimeStudy(103)) ret = ret.times(Math.max(getFullEffRGs(), 1))
	if (hasTimeStudy(151)) ret = ret.times(1e4)
	if (hasTimeStudy(221)) ret = ret.times(tsMults[221]())
	if (hasTimeStudy(227) && tier == 4) ret = ret.times(tsMults[227]())
	return ret
}

function getRepToTDExp() {
	let x = hasMTS(302) ? 0.125 : 0.1
	return x
}

function updateInfiniteTimeTemp() {
	if (!tmp.eterUnl || !hasAch("r105")) {
		tmp.it = E(1)
		tmp.baseIt = E(1)
		return
	}

	var x = (3 - getTickspeed().log10()) * 5e-6
	if (tmp.ngp3) x = softcap(Decimal.pow(10, x), "it").log10()
	tmp.it = Decimal.pow(10, x)
}

function getTimeDimensionPower(tier) {
	if (player.currentEternityChall == "eterc11") return E(1)
	if (tmp.be) return getBreakEternityTDMult(tier)
	let dim = player["timeDimension" + tier]
	let ret = dim.power.pow(player.boughtDims ? 1 : 2)

	if (inNGM(5)) ret = ret.times(getInfinityPowerEffect())
	if (inNGM(4)) ret = doNGMatLeast4TDChanges(tier, ret)

	if (hasTimeStudy(11) && tier == 1) ret = ret.times(tsMults[11]())

	if (hasAch("r105")) ret = ret.times(tmp.it)
	ret = ret.times(getERTDAchMults())

	let ret2 = calcNGM2atleastTDPreVPostDilMultiplier(tier)
	if (!inNGM(2)) ret = ret.times(ret2)
	ret = ret.times(calcVanillaTSTDMult(tier))

	if (hasPU(21)) ret = ret.times(puMults[21]())
	if (ECComps("eterc10") !== 0) ret = ret.times(getECReward(10))
	if (hasAch("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))
	if (hasGalUpg(43)) ret = ret.times(galMults.u43())
	if (!hasDilationUpg("ngmm2") && hasDilationUpg(5) && !tmp.ngC && player.replicanti.amount.gt(1)) ret = ret.times(tmp.rm.pow(getRepToTDExp()))

	ret = dilates(ret, 2)
	if (inNGM(2)) ret = ret.times(ret2)

	ret = dilates(ret, 1)
	if (hasDilationUpg("ngmm2") && hasDilationUpg(5) && player.replicanti.amount.gt(1)) ret = ret.times(tmp.rm.pow(getRepToTDExp()))
	if (tmp.ngC && ngC.tmp) ret = ret.times(ngC.condense.tds.eff(tier))

	if (hasDilationUpg("ngmm8")) ret = ret.pow(getDil71Mult())
	if (tmp.ngC) ret = softcap(ret, "tds_ngC")

	return ret.pow(getTimeDimensionExp())
}

function getTimeDimensionExp() {
	let ret = 1
	if (enB.active("pos", 6)) ret = enB_tmp.eff.pos6
	return ret
}

function getTimeDimensionProduction(tier) {
  	if (player.currentEternityChall == "eterc1" || player.currentEternityChall == "eterc10") return E(0)
  	let dim = player["timeDimension" + tier]
  	if (player.currentEternityChall == "eterc11") return dim.amount
  	let ret = dim.amount
  	ret = ret.times(getTimeDimensionPower(tier))
  	if (tmp.ngmX>3&&(inNC(2)||player.currentChallenge=="postc1"||player.pSac!=undefined)) ret = ret.times(player.chall2Pow)
  	if (player.currentEternityChall == "eterc7") ret = dilates(ret.div(tmp.ngC ? 1 : player.tickspeed.div(1000)))
  	if (tmp.ngmX>3&&(tier>1||!hasAch("r12"))) ret = ret.div(100)
  	if (player.currentEternityChall == "eterc1") return E(0)
  	return ret
}

function getIC3EffFromFreeUpgs() {
	return inNGM(2) ? 1 : 0
}

function isTDUnlocked(t) {
	if (QCs.in(3)) return false
	if (t > 8) return false
	if (inNGM(4)) {
		if (haveSixDimensions() && t > 6) return false
		return player.tdBoosts >= t - 1 
	}
	return t <= 4 || player.dilation.studies.includes(t - 3)
}

function getTimeDimensionDescription(tier) {
	let amt = player['timeDimension' + tier].amount
	let bgt = player['timeDimension' + tier].bought
	let tierAdd = ((inNC(7) && tmp.ngmX == 4) || inNGM(5) ? 2 : 1) + tier
	let tierMax = (haveSixDimensions() && tmp.ngmX == 4) || inNGM(5) ? 6 : 8

	let toGain = E(0)
	if (tierAdd <= tierMax) toGain = getTimeDimensionProduction(tierAdd).div(10)
	if (tmp.inEC12) toGain = toGain.div(getEC12Mult())

	return (!toGain.gt(0) ? getFullExpansion(bgt) : shortenND(amt)) + (aarMod.logRateChange !== 2 && player.timeShards.e <= 1e6 ? getDimensionRateOfChangeDisplay(amt, toGain) : "")
}

function updateTimeDimensions() {
	if (el("timedimensions").style.display == "block" && el("dimensions").style.display == "block") {
		updateTimeShards()

		let maxCost = getMaxTDCost()
		for (let tier = 1; tier <= 8; ++tier) {
			if (isTDUnlocked(tier)) {
				let cost = player["timeDimension" + tier].cost
				el("timeRow" + tier).style.display = "table-row"
				el("timeD" + tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
				el("timeAmount" + tier).textContent = getTimeDimensionDescription(tier);
				el("timeMax" + tier).textContent = inNGM(4) && cost.gte(maxCost) ? "Maxed out!" : (pH.did("quantum") ? '' : "Cost: ") + (inNGM(4) ? shortenPreInfCosts(cost) + "" : shortenDimensions(cost) + " EP")
				if (getOrSubResourceTD(tier).gte(player["timeDimension" + tier].cost)) el("timeMax"+tier).className = "storebtn"
			else el("timeMax" + tier).className = "unavailablebtn"
			} else el("timeRow" + tier).style.display = "none"
			if (tmp.ngC) ngC.condense.tds.update(tier)
		}

		if (inNGM(4)) {
			var isShift = player.tdBoosts + 1 < (inNGM(5) ? 6 : 8)
			var req = getTDBoostReq()
			el("tdReset").style.display = ""
			el("tdResetLabel").textContent = "Time Dimension "+(isShift ? "Shift" : "Boost") + " (" + getFullExpansion(player.tdBoosts) + "): requires " + getFullExpansion(req.amount) + " " + DISPLAY_NAMES[req.tier] + " Time Dimensions"
			el("tdResetBtn").textContent = "Reset the game for a " + (isShift ? "new dimension" : "boost")
			el("tdResetBtn").className = (player["timeDimension" + req.tier].bought < req.amount) ? "unavailablebtn" : "storebtn"
		} else el("tdReset").style.display = "none"

		el("tdCostLimit").textContent = inNGM(4) ? "You can spend up to " + shortenDimensions(maxCost) + " antimatter to Time Dimensions." : ""
	}
}

function updateTimeShards() {
	let p = getTimeDimensionProduction(1)
	if ((inNC(7) && tmp.ngmX == 4) || inNGM(5)) p = p.plus(getTimeDimensionProduction(2))
	if (tmp.inEC12) p = p.div(tmp.ec12Mult)
	if (inNGM(5)) p = p.times(getPDAcceleration())

	el("itmult").textContent = hasAch('r105') && shiftDown ? 'Infinite Time: ' + shorten(tmp.it.pow(getTimeDimensionExp())) + 'x to all Time Dimensions' : ''
	el("timeShardAmount").textContent = shortenMoney(player.timeShards)
	el("tickThreshold").textContent = shortenMoney(player.tickThreshold)
	if (player.currentEternityChall == "eterc7") el("timeShardsPerSec").textContent = "You are getting " + shortenDimensions(p) + " Eighth Infinity Dimensions per second."
	else el("timeShardsPerSec").textContent = "You are getting " + (inNGM(5) && p < 100 ? shortenND(p) : shortenDimensions(p)) + " Time Shards per " + (tmp.PDunl ? "real-life " : "") + "second."
}

var TIME_DIM_COSTS = {
	1: {
		cost() {
			if (inNGM(4)) return 10
			return 1
		},
		mult() {
			if (inNGM(4)) return 1.5
			return 3
		}
	},
	2: {
		cost() {
			if (inNGM(4)) return 20
			return 5
		},
		mult() {
			if (inNGM(4)) return 2
			return 9
		}
	},
	3: {
		cost() {
			if (inNGM(4)) return 40
			return 100
		},
		mult() {
			if (inNGM(4)) return 3
			return 27
		}
	},
	4: {
		cost() {
			if (inNGM(4)) return 80
			return 1e3
		},
		mult() {
			if (inNGM(4)) return 20
			return 81
		}
	},
	5: {
		cost() {
			let x = inNGM(4) ? 160 : aarMod.newGamePlusVersion ? "1e2300" : "1e2350"
			if (tmp.ngC) x = Decimal.pow(x, .25)
			return E(x)
		},
		mult() {
			if (inNGM(4)) return 150
			return 243
		}
	},
	6: {
		cost() {
			let x = inNGM(4) ? 1e8 : aarMod.newGamePlusVersion ? "1e2500" : "1e2650"
			if (tmp.ngC) x = Decimal.pow(x, .25)
			return E(x)
		},
		mult() {
			if (inNGM(4)) return 1e5
			return 729
		}
	},
	7: {
		cost() {
			let x = inNGM(4) ? 1e12 : aarMod.newGamePlusVersion ? "1e2700" : "1e3000"
			if (tmp.ngC) x = Decimal.pow(x, .25)
			return E(x)
		},
		mult() {
			if (inNGM(4)) return 3e6
			return 2143
		}
	},
	8: {
		cost() {
			let x = inNGM(4) ? 1e18 : aarMod.newGamePlusVersion ? "1e3000" : "1e3350"
			if (tmp.ngC) x = Decimal.pow(x, .25)
			return E(x)
		},
		mult() {
			if (inNGM(4)) return 1e8
			return 6561
		}
	},
}

function timeDimCost(tier, bought) {
	let base = TIME_DIM_COSTS[tier].cost()
	let mult = TIME_DIM_COSTS[tier].mult()

	let cost = Decimal.pow(mult, bought).times(base)
	if (inNGM(2)) return cost

	if (cost.gte(Number.MAX_VALUE)) cost = Decimal.pow(mult * 1.5, bought).times(base)
	if (cost.gte("1e1300")) cost = Decimal.pow(mult * 2.2, bought).times(base)
	if (tier >= 5) cost = Decimal.pow(mult * 100, bought).times(base)

	let superScaleStartLog = tier >= 5 ? 3e5 : 2e4
	if (cost.log10() >= superScaleStartLog) {
		// rather than fixed cost scaling as before, quadratic cost scaling
		// to avoid exponential growth
		cost = cost.times(Decimal.pow(10, Math.pow((cost.log10() - superScaleStartLog) / 1e3, 2) * 1e3))
	}

	return cost
}

function buyTimeDimension(tier) {
	let dim = player["timeDimension"+tier]
	if (inNGM(4) && getAmount(1) < 1) {
		alert("You need to buy a first Normal Dimension to be able to buy Time Dimensions.")
		return
	}
	if (!isTDUnlocked(tier)) return false
	if (getOrSubResourceTD(tier).lt(dim.cost)) return false

	getOrSubResourceTD(tier, dim.cost)
	dim.amount = dim.amount.plus(1);
	dim.bought += 1
	if (inNGM(4)) {
		dim.cost = dim.cost.times(TIME_DIM_COSTS[tier].mult())
		if (inNC(2) || player.currentChallenge == "postc1" || player.pSac !== undefined) player.chall2Pow = 0
	} else {
		dim.power = dim.power.times(player.boughtDims ? 3 : 2)
		dim.cost = timeDimCost(tier, dim.bought)
		updateEternityUpgrades()
	}
	if (tier === 6 && inNGM(5)) giveAchievement("Out of luck")
	return true
}

function getOrSubResourceTD(tier, sub) {
	if (sub == undefined) {
		if (inNGM(4)) return player.money.min(getMaxTDCost())
		return player.eternityPoints
	} else {
		if (inNGM(4)) player.money = player.money.sub(player.money.min(sub))
		else player.eternityPoints = player.eternityPoints.sub(player.eternityPoints.min(sub))
	}
}

function buyMaxTimeDimension(tier, bulk) {
	if (!isTDUnlocked(tier)) return

	let dim = player['timeDimension' + tier]
	let res = getOrSubResourceTD(tier)
	let mult = TIME_DIM_COSTS[tier].mult()
	if (!res.gte(dim.cost)) return

	if (inNGM(4) && getAmount(1) < 1) return
	if (aarMod.maxHighestTD && tier < 8 && player["timeDimension" + (tier + 1)].bought > 0) return

	let toBuy = 0

	if (inNGM(4)) {
		toBuy = Math.floor(res.div(dim.cost).times(mult - 1).add(1).log(mult))
		if (bulk) toBuy = Math.min(toBuy, bulk)

		getOrSubResourceTD(tier, Decimal.pow(mult, toBuy).sub(1).div(mult - 1).times(dim.cost))

		if (inNC(2) || player.currentChallenge == "postc1" || player.pSac != undefined) player.chall2Pow = 0
	} else {
		let data = doBulkSpent(player.eternityPoints, (x) => timeDimCost(tier, x), dim.bought)

		if (player.eternityPoints.lt(Decimal.pow(10, 1e10))) player.eternityPoints = data.res
		toBuy = data.toBuy
	}

	dim.amount = dim.amount.plus(toBuy)
	dim.bought += toBuy
	if (inNGM(4)) {
		dim.power = Decimal.pow(getDimensionPowerMultiplier(), toBuy / 2).times(dim.power)
		dim.cost = dim.cost.times(Decimal.pow(mult, toBuy))
	} else {
		dim.cost = timeDimCost(tier, dim.bought)
		dim.power = dim.power.times(Decimal.pow(player.boughtDims ? 3 : 2, toBuy))
		updateEternityUpgrades()
	}
	if (tier === 6 && inNGM(5)) giveAchievement("Out of luck")
}

function buyMaxTimeDimensions() {
	for (let i = 1; i <= 8; i++) {
		if (tmp.ngC) ngC.condense.tds.max(i)
		buyMaxTimeDimension(i)
	}
}

function toggleAllTimeDims() {
	var turnOn
	var id = 1
	while (id <= 8 && turnOn === undefined) {
		if (!player.autoEterOptions["td" + id]) turnOn = true
		else if (id > 7) turnOn = false
		id++
	}
	for (id = 1; id <= 8; id++) {
		player.autoEterOptions["td" + id] = turnOn
		el("td" + id + 'auto').textContent = "Auto: " + (turnOn ? "ON" : "OFF")
	}
	el("maxTimeDimensions").style.display = turnOn ? "none" : ""
}
