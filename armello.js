NUM_TRIALS = 100000;

SWORD = 0;
SHIELD = 1;
SUN = 2;
MOON = 3;
WYLD = 4;
ROT = 5;


function SubmitCombatOdds()
{
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
}

function CalcCombatOdds(
    p1_fight, p1_start_hp, p1_swords, p1_shields,
    p2_fight, p2_start_hp, p2_swords, p2_shields,
    p2_is_king
) {
    var p1_end_hp_total = 0;
    var p2_end_hp_total = 0;
    var p1_deaths = 0;
    var p2_deaths = 0;
    for(var i = 0; i < NUM_TRIALS; ++i) {
        var result = trial(p1_fight, p1_start_hp, p1_swords, p1_shields,
                           p2_fight, p2_start_hp, p2_swords, p2_shields,
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
    p1_fight, p1_hp, p1_swords, p1_shields,
    p2_fight, p2_hp, p2_swords, p2_shields,
    p2_is_king
) {
    var p1_result = roll_dice(p1_fight, false);
    p1_swords += p1_result.swords;
    p1_shields += p1_result.shields;
    if(p2_is_king) {
        // Effect of Pride's Edge
        p2_fight += p1_result.misses;
    }
    var p2_result = roll_dice(p2_fight, p2_is_king);
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
    while(num_dice > 0) {
        var die = Math.floor(Math.random()*6);
        if(die == SWORD || die == SUN || die == WYLD) {
            ++swords;
        }
        else if(die == SHIELD) {
            ++shields;
        }
        else {
            // We check for Rot instead of Wyld because this routine assumes the character is not corrupt
            if(wyldhide && die == ROT) {
                shields += 1;
            } else {
                ++misses;
            }
        }
        if(die != WYLD) {
            --num_dice;
        }
    }
    return {swords: swords,
             shields: shields,
             misses: misses};
}
