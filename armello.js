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
        is_king: false,
        deaths: 0,                          // will be updated
        end_hp_total: 0                     // will be updated
    };

    var p2 = {
        num_dice: parseInt($("#CombatTheirDice").val()),
        start_hp: parseInt($("#CombatTheirHealth").val()),
        swords: parseInt($("#CombatTheirSwords").val()),
        piercing_swords: parseInt($("#CombatTheirPiercingSwords").val()),
        shields: parseInt($("#CombatTheirShields").val()),
        sunmoon_explode: $('#CombatTheirSunMoonExplode').prop('checked'),
        is_king: $('#CombatKing').prop('checked'),
        deaths: 0,                          // will be updated
        end_hp_total: 0                     // will be updated
    };

    CalcCombatOdds(p1, p2);

    alert(
        "Your average ending HP: " + (p1.end_hp_total/NUM_TRIALS).toFixed(1) +
        "\nTheir average ending HP: " + (p2.end_hp_total/NUM_TRIALS).toFixed(1) +
        "\nChance you die: " + Math.round(p1.deaths/NUM_TRIALS * 100) + "%" +
        "\nChance they die: " + Math.round(p2.deaths/NUM_TRIALS * 100) + "%"
    );

    // prevent submit action from reloading form
    return false;
};

function CalcCombatOdds(p1, p2)
{
    var i;
    for(i = 0; i < NUM_TRIALS; ++i) {
        trial(p1, p2);
    }
}

function trial(p1, p2)
{
    var p1_result = handle_player_roll(p1, p2, 0);
    var p2_result = handle_player_roll(p2, p1, p1_result.misses);
    update_player_health(p1, p1_result, p2, p2_result);
    update_player_health(p2, p2_result, p1, p1_result);
}

// opponents_misses is only relevant for Pride's Edge
// It will be 0 when player is player 1
function handle_player_roll(player, opponent, opponents_misses)
{
    // Effect of Pride's Edge
    var extra_dice = player.is_king ? opponents_misses : 0;

    var result = roll_dice(player, extra_dice);
    var swords = player.swords + result.swords;
    var shields = player.shields + result.shields;
    shields = Math.max(shields - opponent.piercing_swords, 0);
    return {swords: swords,
             shields, shields,
             misses: result.misses};
}

function update_player_health(player, player_result, opponent, opponent_result)
{
    var damage = Math.max(opponent_result.swords - player_result.shields, 0) + opponent.piercing_swords;
    var hp = player.start_hp - damage;
    if(hp <= 0) {
        ++player.deaths;
    }
    player.end_hp_total += hp;
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
