Armello = {};
(function() {
"use strict";

var NUM_TRIALS = 100000;

var SWORD = 0;
var SHIELD = 1;
var SUNMOON_HIT = 2;
var SUNMOON_MISS = 3;
var WYLDROT_HIT = 4;
var WYLDROT_MISS = 5;


Armello.SubmitCombatOdds = function() {
    var p1 = {
        num_dice: parseInt($("#CombatYourDice").val()),
        start_hp: parseInt($("#CombatYourHealth").val()),
        swords: parseInt($("#CombatYourSwords").val()),
        piercing_swords: parseInt($("#CombatYourPiercingSwords").val()),
        shields: parseInt($("#CombatYourShields").val()),
        sunmoon_explode: $('#CombatYourSunMoonExplode').prop('checked'),
        is_king: false
    };

    var p2 = {
        num_dice: parseInt($("#CombatTheirDice").val()),
        start_hp: parseInt($("#CombatTheirHealth").val()),
        swords: parseInt($("#CombatTheirSwords").val()),
        piercing_swords: parseInt($("#CombatTheirPiercingSwords").val()),
        shields: parseInt($("#CombatTheirShields").val()),
        sunmoon_explode: $('#CombatTheirSunMoonExplode').prop('checked'),
        is_king: $('#CombatKing').prop('checked')
    };

    CalcCombatOdds(p1, p2);

    // prevent submit action from reloading form
    return false;
};

function CalcCombatOdds(p1, p2)
{
    var p1_end_hp_total = 0;
    var p2_end_hp_total = 0;
    var p1_deaths = 0;
    var p2_deaths = 0;
    var i, result;
    for(i = 0; i < NUM_TRIALS; ++i) {
        result = trial(p1, p2);
        p1_end_hp_total += result.p1_end_hp;
        p2_end_hp_total += result.p2_end_hp;
        if(result.p1_end_hp <= 0) {
            ++p1_deaths;
        }
        if(result.p2_end_hp <= 0) {
            ++p2_deaths;
        }
    }
    alert(
        "Your average ending HP: " + (p1_end_hp_total/NUM_TRIALS).toFixed(1) +
        "\nTheir average ending HP: " + (p2_end_hp_total/NUM_TRIALS).toFixed(1) +
        "\nChance you die: " + Math.round(p1_deaths/NUM_TRIALS * 100) + "%" +
        "\nChance they die: " + Math.round(p2_deaths/NUM_TRIALS * 100) + "%"
    );
}

function trial(p1, p2)
{
    var p1_result = roll_dice(p1, 0);
    var p1_swords = p1.swords + p1_result.swords;
    var p1_shields = p1.shields + p1_result.shields;
    p1_shields = Math.max(p1_shields - p2.piercing_swords, 0);
    // Effect of Pride's Edge
    var extra_dice = p2.is_king ? p1_result.misses : 0;
    var p2_result = roll_dice(p2, extra_dice);
    var p2_swords = p2.swords + p2_result.swords;
    var p2_shields = p2.shields + p2_result.shields;
    p2_shields = Math.max(p2_shields - p1.piercing_swords, 0);
    var p1_hp = p1.start_hp - Math.max(p2_swords - p1_shields, 0) + p2.piercing_swords;
    var p2_hp = p2.start_hp - Math.max(p1_swords - p2_shields, 0) + p1.piercing_swords;
    return {p1_end_hp: p1_hp,
             p2_end_hp: p2_hp};
}

function roll_dice(player, num_extra_dice)
{
    var swords = 0;
    var shields = 0;
    var misses = 0;
    var num_dice, die;
    for(num_dice = player.num_dice + num_extra_dice; num_dice > 0; --num_dice) {
        die = Math.floor(Math.random()*6);
        if(die === SWORD || die === SUNMOON_HIT || die === WYLDROT_HIT) {
            ++swords;
            if(die === WYLDROT_HIT || (player.sunmoon_explode && die === SUNMOON_HIT)) {
                ++num_dice;
            }
        } else if(die === SHIELD) {
            ++shields;
        } else {
            // Effect of Wyldhide
            if(player.is_king && die === WYLDROT_MISS) {
                ++shields;
            } else {
                ++misses;
            }
        }
    }
    return {swords: swords,
             shields: shields,
             misses: misses};
}

}());
