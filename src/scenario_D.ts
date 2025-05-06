type Clothe = {
  color: "white" | "color" | "black";
  fabric: "cotton" | "wool" | "synthetic";
  dirtyLevel: "low" | "medium" | "high";
};

interface WashStrategy {
  apply(clothes: Clothe[]): Record<string, Clothe[]>;
}

class ColorWashStrategy implements WashStrategy {
  apply(clothes: Clothe[]): Record<string, Clothe[]> {
    return clothes.reduce((groups, clothe) => {
      if (!groups[clothe.color]) {
        groups[clothe.color] = [];
      }

      groups[clothe.color].push(clothe);

      return groups;
    }, {} as Record<string, Clothe[]>);
  }
}

class FabricWashStrategy implements WashStrategy {
  apply(clothes: Clothe[]): Record<string, Clothe[]> {
    return clothes.reduce((groups, clothe) => {
      if (!groups[clothe.fabric]) {
        groups[clothe.fabric] = [];
      }

      groups[clothe.fabric].push(clothe);

      return groups;
    }, {} as Record<string, Clothe[]>);
  }
}

class DirtyWashStrategy implements WashStrategy {
  apply(clothes: Clothe[]): Record<string, Clothe[]> {
    return clothes.reduce((groups, clothe) => {
      if (!groups[clothe.dirtyLevel]) {
        groups[clothe.dirtyLevel] = [];
      }

      groups[clothe.dirtyLevel].push(clothe);

      return groups;
    }, {} as Record<string, Clothe[]>);
  }
}

class WashMachine {
  private clothes: Clothe[] = [];

  put(clothes: Clothe[]): void {
    this.clothes = clothes;
  }

  run() {
    console.log("Washing clothes...", this.clothes);
  }
}

class IAvomatic {
  private machines: WashMachine[] = [
    new WashMachine(),
    new WashMachine(),
    new WashMachine(),
  ];
  private clothes: Clothe[] = [];
  private strategy: WashStrategy;

  addClothes(...clothes: Clothe[]): void {
    this.clothes.push(...clothes);
  }

  by(strategy: WashStrategy): void {
    this.strategy = strategy;
  }

  run(): void {
    console.log("Washing clothes with strategy", this.strategy);

    Object.values(this.strategy.apply(this.clothes)).forEach(
      (clothesGroup, index) => this.machines[index].put(clothesGroup)
    );

    this.machines.forEach((machine) => machine.run());

    console.log("Washing finished");
  }
}

function main() {
  const iavomatic = new IAvomatic();

  iavomatic.addClothes(
    {
      color: "white",
      fabric: "cotton",
      dirtyLevel: "low",
    },
    {
      color: "black",
      fabric: "wool",
      dirtyLevel: "high",
    },
    {
      color: "color",
      fabric: "synthetic",
      dirtyLevel: "medium",
    },
    {
      color: "white",
      fabric: "cotton",
      dirtyLevel: "high",
    }
  );

  iavomatic.by(new ColorWashStrategy());
  iavomatic.run();

  iavomatic.by(new FabricWashStrategy());
  iavomatic.run();

  iavomatic.by(new DirtyWashStrategy());
  iavomatic.run();
}

main();
