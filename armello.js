NUM_TRIALS = 100000;

SWORD = 0;
SHIELD = 1;
SUN = 2;
MOON = 3;
WYLD = 4;
WORM = 5;


function SubmitCombatOdds()
{
    CalcCombatOdds(
        $("#CombatYourFight").val(),
        $("#CombatYourHealth").val(),
        $("#CombatTheirFight").val(),
        $("#CombatTheirHealth").val()
    );
}

function CalcCombatOdds(p1_fight, p1_start_hp, p2_fight, p2_start_hp)
{
    var p1_end_hp_total = 0;
    var p2_end_hp_total = 0;
    var p1_deaths = 0;
    var p2_deaths = 0;
    for(var i = 0; i < NUM_TRIALS; ++i) {
        var result = trial(p1_fight, p1_start_hp, p2_fight, p2_start_hp);
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

function trial(p1_fight, p1_start_hp, p2_fight, p2_start_hp)
{
    var p1_result = roll_dice(p1_fight);
    var p2_result = roll_dice(p2_fight);
    var p1_end_hp = p1_start_hp - Math.max(p2_result.swords - p1_result.shields, 0);
    var p2_end_hp = p2_start_hp - Math.max(p1_result.swords - p2_result.shields, 0);
    return {p1_end_hp: p1_end_hp,
             p2_end_hp: p2_end_hp};
}

function roll_dice(num_dice)
{
    var swords = 0;
    var shields = 0;
    while(num_dice > 0) {
        var die = Math.floor(Math.random()*6);
        if(die == SWORD || die == SUN || die == WYLD) {
            ++swords;
        }
        else if(die == SHIELD) {
            ++shields;
        }
        if(die != WYLD) {
            --num_dice;
        }
    }
    return {swords: swords,
             shields: shields};
}
