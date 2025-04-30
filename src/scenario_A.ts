const FPS = 1000 / 60;

// Interface permettant de partager le comportement des personnages
// Qui pourraient être lancé après avoir interargi avec une manette par exemple
interface CharacterBehavior {
  attack(): void;
  jump(): void;
  move(): void;
  beingHit(): void;
  whatItsState(): void;
}

class Character implements CharacterBehavior {
  constructor(private state: CharacterState = new IdleState(this)) {}

  toState(state: CharacterState): void {
    console.log(
      `Personnage passe de [${this.state.constructor.name}] à [${state.constructor.name}]`
    );

    this.state = state;
    this.state.run();
  }

  screamAttack(): void {
    console.log("BWAAAAAAAAH !!!!!");
  }

  hitTheGround(): void {
    console.log("HUMPF! The ground is hard.");
  }

  attack(): void {
    console.log("Le personnage veut attaquer");
    this.state.attack();
  }

  jump(): void {
    console.log("Le personnage veut sauter");
    this.state.jump();
  }

  move(): void {
    console.log("Le personnage veut se déplacer");
    this.state.move();
  }

  beingHit(): void {
    console.log("Le personnage est touché par une attaque");
    this.state.beingHit();
  }

  whatItsState(): void {
    this.state.whatItsState();
  }
}

abstract class CharacterState implements CharacterBehavior {
  constructor(protected readonly character: Character) {}

  // Méthode permettant de lancer l'action principale de l'état
  // C'est un choix personnel, pour éviter par exemple de répêter l'action de l'attaque
  // Qui lance un screamAttack depuis n'importe quel état
  abstract run(): void;

  abstract attack(): void;
  abstract jump(): void;
  abstract move(): void;
  abstract beingHit(): void;
  abstract whatItsState(): void;
}

class IdleState extends CharacterState {
  whatItsState(): void {
    console.log("Le personnage est en état d'attente");
  }

  run(): void {
    // Nothing
  }

  attack(): void {
    this.character.toState(new AttackState(this.character, this));
  }

  jump(): void {
    this.character.toState(new JumpState(this.character));
  }

  move(): void {
    this.character.toState(new MoveState(this.character));
  }

  beingHit(): void {
    // Nothing
    console.log(
      "Le personnage bloque l'attaque, comportement un peu comme Soulcalibur, où ne pas bouger permet de se protéger de certaines attaques"
    );
  }
}

class AttackState extends CharacterState {
  private timer: number;

  constructor(character: Character, private readonly oldState: CharacterState) {
    super(character);
  }

  run(): void {
    this.character.screamAttack();
    this.timer = setTimeout(() => {
      console.log("Attaque finie");
      this.character.toState(this.oldState);
    }, 50);
  }

  whatItsState(): void {
    console.log("Le personnage est en état d'attaque");
  }

  attack(): void {
    clearTimeout(this.timer);
    this.character.toState(new AttackState(this.character, this.oldState));
  }

  jump(): void {
    // Nothing
    console.log(
      "Le personnage ne peut pas sauter tant qu'il est en train d'attaquer"
    );
  }

  move(): void {
    // Nothing
    console.log(
      "Le personnage ne peut pas se déplacer tant qu'il est en train d'attaquer"
    );
  }

  beingHit(): void {
    this.character.toState(new StunnedState(this.character));
  }
}

class JumpState extends CharacterState {
  private jumpDuration: number = 200;
  private jumpPower: number = 1;
  private timeout: number;

  constructor(character: Character, jumpOptions?: { power?: number }) {
    super(character);
    this.jumpPower = jumpOptions?.power ?? this.jumpPower;
  }

  private startJumpTimer() {
    this.timeout = setTimeout(() => {
      console.log("Character is touching the ground");
      this.character.hitTheGround();

      this.clearTimers();
      this.character.toState(new IdleState(this.character));
    }, this.jumpDuration * this.jumpPower);
  }

  private clearTimers() {
    clearTimeout(this.timeout);
  }

  run(): void {
    this.startJumpTimer();
  }

  whatItsState(): void {
    console.log("Le personnage est en état de saut");
  }

  attack(): void {
    this.character.toState(new AttackState(this.character, this));
  }

  jump(): void {
    // On simule une forme de double saut
    this.clearTimers();
    this.character.toState(new JumpState(this.character, { power: 2 }));
  }

  move(): void {
    // Nothing
    console.log(
      "Le personnage ne peut pas se déplacer tant qu'il est en train de sauter"
    );
  }

  beingHit(): void {
    this.character.toState(new StunnedState(this.character));
  }
}

class MoveState extends CharacterState {
  run(): void {
    // Nothing
  }

  whatItsState(): void {
    console.log("Le personnage est en état de déplacement");
  }

  attack(): void {
    this.character.toState(new AttackState(this.character, this));
  }

  jump(): void {
    this.character.toState(new JumpState(this.character));
  }

  move(): void {
    // Nothing
    console.log("Le personnage est en train de se déplacer");
  }

  beingHit(): void {
    this.character.toState(new StunnedState(this.character));
  }
}

class StunnedState extends CharacterState {
  constructor(protected readonly character: Character) {
    super(character);
  }

  private startStun(): void {
    setTimeout(() => {
      this.character.toState(new IdleState(this.character));
    }, 1000);
  }

  run(): void {
    this.startStun();
  }

  whatItsState(): void {
    console.log("Le personnage est étourdi");
  }

  attack(): void {
    // Nothing
    console.log("Le personnage est étourdi et ne peut pas attaquer");
  }

  jump(): void {
    // Nothing
    console.log("Le personnage est étourdi et ne peut pas sauter");
  }

  move(): void {
    // Nothing
    console.log("Le personnage est étourdi et ne peut pas se déplacer");
  }

  beingHit(): void {
    // Nothing
    console.log(
      "Le personnage est étourdi et ne peut pas être touché (bonjour l'abus sinon)"
    );
  }
}

// J'utilise ici un factory pour récupérer un personnage mais qui n'a que les méthodes de comportement
function makeCharacter(): CharacterBehavior {
  return new Character();
}

// Code client
function main() {
  // Comme character est de type CharacterBehavior, il n'a que les méthodes de comportement
  // Et ne peut pas gérer le changement d'état du personnage par exemple
  const character = makeCharacter();

  const stateLogInterval = setInterval(() => {
    character.whatItsState();
  }, FPS);

  // On simule un déplacement, dans l'idée c'est une action qui peut se répéter beaucoup de fois en 1 seconde
  // (60x à 60 FPS par exemple tant que l'on maintient le joystick)
  const moveInterval = setInterval(() => {
    character.move();
  }, FPS);

  // Après 600ms, on simule qu'il se fasse toucher pendant le déplacement
  // Il ne pourra pas se déplacer pendant tout le temps qu'il est étourdi
  setTimeout(() => {
    character.beingHit();
    // Même si on spamme l'attaque comme un rageux :)
    character.attack();
    character.attack();
    character.attack();
    character.attack();
    character.attack();
  }, 600);

  setTimeout(() => {
    clearInterval(moveInterval);
  }, 1000);

  setTimeout(() => {
    character.jump();
  }, 1500);

  setTimeout(() => {
    character.jump();
    character.attack();
    character.attack();
    character.attack();
  }, 1700);

  setTimeout(() => {
    clearInterval(stateLogInterval);
  }, 2000);
}

main();
