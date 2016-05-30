# This was a crude Python 3.x prototype before starting on the JavaScript
# version. It is retained only for hysterical interest.


import random
import sys


NUM_TRIALS = 100000


SWORD = 0
SHIELD = 1
SUN = 2
MOON = 3
WYLD = 4
WORM = 5


def main():
    p1dice = int(input("Your dice: "))
    p1_start_hp = int(input("Your health: "))
    p2dice = int(input("Their dice: "))
    p2_start_hp = int(input("Their health: "))

    p1_end_hp_total = 0
    p2_end_hp_total = 0
    p1deaths = 0
    p2deaths = 0
    for i in range(NUM_TRIALS):
        p1_end_hp, p2_end_hp = trial(p1dice, p1_start_hp, p2dice, p2_start_hp)
        p1_end_hp_total += p1_end_hp
        p2_end_hp_total += p2_end_hp
        if p1_end_hp <= 0:
            p1deaths += 1
        if p2_end_hp <= 0:
            p2deaths += 1

    print()
    print("Your average ending HP:", p1_end_hp_total/NUM_TRIALS)
    print("Their average ending HP:", p2_end_hp_total/NUM_TRIALS)
    print("You die {:.1%} of the time".format(p1deaths/NUM_TRIALS))
    print("They die {:.1%} of the time".format(p2deaths/NUM_TRIALS))


def trial(p1dice, p1hp, p2dice, p2hp):
    p1swords, p1shields = roll_dice(p1dice)
    p2swords, p2shields = roll_dice(p2dice)
    p1hp -= max(p2swords - p1shields, 0)
    p2hp -= max(p1swords - p2shields, 0)
    return p1hp, p2hp


def roll_dice(num_dice):
    swords = 0
    shields = 0
    while num_dice > 0:
        die = random.randint(0, 5)
        if die in (SWORD, SUN, WYLD):
            swords += 1
        elif die == SHIELD:
            shields += 1
        if die != WYLD:
            num_dice -= 1
    return swords, shields


if __name__ == '__main__':
    sys.exit(main())
