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
    CalcCombatOdds(
        parseInt($("#CombatYourDice").val()),
        parseInt($("#CombatYourHealth").val()),
        parseInt($("#CombatYourSwords").val()),
        parseInt($("#CombatYourShields").val()),
        parseInt($("#CombatTheirDice").val()),
        parseInt($("#CombatTheirHealth").val()),
        parseInt($("#CombatTheirSwords").val()),
        parseInt($("#CombatTheirShields").val()),
        $('#CombatKing').prop('checked')
    );

    // prevent submit action from reloading form
    return false;
};

function CalcCombatOdds(
    p1_num_dice, p1_start_hp, p1_swords, p1_shields,
    p2_num_dice, p2_start_hp, p2_swords, p2_shields,
    p2_is_king
) {
    var p1_end_hp_total = 0;
    var p2_end_hp_total = 0;
    var p1_deaths = 0;
    var p2_deaths = 0;
    var i, result;
    for(i = 0; i < NUM_TRIALS; ++i) {
        result = trial(p1_num_dice, p1_start_hp, p1_swords, p1_shields,
                       p2_num_dice, p2_start_hp, p2_swords, p2_shields,
                       p2_is_king);
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

function trial(
    p1_num_dice, p1_hp, p1_swords, p1_shields,
    p2_num_dice, p2_hp, p2_swords, p2_shields,
    p2_is_king
) {
    var p1_result = roll_dice(p1_num_dice, false);
    p1_swords += p1_result.swords;
    p1_shields += p1_result.shields;
    if(p2_is_king) {
        // Effect of Pride's Edge
        p2_num_dice += p1_result.misses;
    }
    var p2_result = roll_dice(p2_num_dice, p2_is_king);
    p2_swords += p2_result.swords;
    p2_shields += p2_result.shields;
    p1_hp -= Math.max(p2_swords - p1_shields, 0);
    p2_hp -= Math.max(p1_swords - p2_shields, 0);
    return {p1_end_hp: p1_hp,
             p2_end_hp: p2_hp};
}

function roll_dice(num_dice, wyldhide)
{
    var swords = 0;
    var shields = 0;
    var misses = 0;
    var die;
    while(num_dice > 0) {
        die = Math.floor(Math.random()*6);
        if(die === SWORD || die === SUNMOON_HIT || die === WYLDROT_HIT) {
            ++swords;
        }
        else if(die === SHIELD) {
            ++shields;
        }
        else {
            if(wyldhide && die === WYLDROT_MISS) {
                ++shields;
            } else {
                ++misses;
            }
        }
        if(die !== WYLDROT_HIT) {
            --num_dice;
        }
    }
    return {swords: swords,
             shields: shields,
             misses: misses};
}

}());
