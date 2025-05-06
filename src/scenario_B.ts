type AirportComponentType = Plane | Runway;
type AirportEvent = {
  sender: AirportComponentType;
  wantTo: "land" | "takeoff" | "end_landing" | "end_takeoff";
};
type RunwayProps = {
  id: string;
  onRunwayPlaneId: string | null;
};
type PlaneProps = {
  id: string;
  state: "off" | "landing" | "takeoff" | "flying";
  runwayIdToLandOn: string | null;
  runwayIdToTakeOfFrom: string | null;
};

interface TowerControl {
  notify(event: AirportEvent): void;
}

abstract class AirportComponent {
  protected towerControl: TowerControl | null = null;

  abstract get id(): string;

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }
}

class Runway extends AirportComponent {
  constructor(private props: RunwayProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }

  isFreeOfPlane(): boolean {
    return this.props.onRunwayPlaneId === null;
  }

  assignPlaneToHandle(planeId: string): void {
    this.props = {
      ...this.props,
      onRunwayPlaneId: planeId,
    };
  }

  freePlane(): void {
    console.log(`Runway ${this.id} is now free to use`);
    this.props = {
      ...this.props,
      onRunwayPlaneId: null,
    };
  }
}

class Plane extends AirportComponent {
  constructor(private props: PlaneProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }

  is(state: PlaneProps["state"]): boolean {
    return this.props.state === state;
  }

  askForLanding() {
    this.towerControl?.notify({ sender: this, wantTo: "land" });
  }

  askForTakeoff() {
    this.towerControl?.notify({ sender: this, wantTo: "takeoff" });
  }

  authorizedToLandOn(runwayId: string) {
    console.log(
      `Plane ${this.props.id} is authorized to land on runway ${runwayId}`
    );

    this.props = {
      ...this.props,
      state: "landing",
      runwayIdToLandOn: runwayId,
    };

    // Simulation de fin de l'atterrissage
    setTimeout(() => {
      this.props = {
        ...this.props,
        state: "off",
      };
      this.towerControl?.notify({ sender: this, wantTo: "end_landing" });
    }, 2000);
  }

  authorizedToTakeoff(runwayId: string) {
    console.log(
      `Plane ${this.props.id} is authorized to takeoff from runway ${runwayId}`
    );

    this.props = {
      ...this.props,
      state: "takeoff",
      runwayIdToTakeOfFrom: runwayId,
    };

    // Simulation de fin du décollage
    setTimeout(() => {
      this.props = {
        ...this.props,
        state: "flying",
      };
      this.towerControl?.notify({ sender: this, wantTo: "end_takeoff" });
    }, 2000);
  }

  freeFromRunway(): string | null {
    const runwayId =
      this.props.runwayIdToLandOn ?? this.props.runwayIdToTakeOfFrom;

    this.props = {
      ...this.props,
      runwayIdToLandOn: null,
      runwayIdToTakeOfFrom: null,
    };

    return runwayId;
  }
}

class MainTowerControl implements TowerControl {
  private airportComponents: AirportComponent[] = [];

  get planes(): Plane[] {
    return this.airportComponents.filter((c): c is Plane => c instanceof Plane);
  }

  get runways(): Runway[] {
    return this.airportComponents.filter(
      (c): c is Runway => c instanceof Runway
    );
  }

  private findFreeRunway(): Runway | null {
    return this.runways.find((r) => r.isFreeOfPlane()) ?? null;
  }

  // ...components est un opérateur de décomposition (spread operator),
  // Ici cela me permet d'avoir une liste de paramètres dont le nombre n'est pas défini
  // Et ces paramètres sont stockés sous la forme d'un tableau
  register(...components: AirportComponent[]): void {
    components.forEach((c) => c.assignTowerControl(this));
    // ... est un opérateur de décomposition (spread operator), je passe le tableau components
    // Comme si je faisais this.airportComponents.push(components[0], components[1], components[2], components[3]);
    this.airportComponents.push(...components);
  }

  notify(event: AirportEvent): void {
    console.log(`☼☼☼ Event ${event.wantTo} received from ${event.sender.id}`);

    // Code améliorable
    switch (event.wantTo) {
      case "land":
        const runwayFreeForLanding = this.findFreeRunway();
        if (!runwayFreeForLanding) {
          console.log(
            `No runway available for landing, sorry ${event.sender.id}`
          );
          return;
        }
        (event.sender as Plane).authorizedToLandOn(runwayFreeForLanding.id);
        runwayFreeForLanding.assignPlaneToHandle(event.sender.id);
        break;
      case "takeoff":
        const runwayFreeForTakeoff = this.findFreeRunway();
        if (!runwayFreeForTakeoff) {
          console.log(
            `No runway available for landing, sorry ${event.sender.id}`
          );
          return;
        }
        (event.sender as Plane).authorizedToTakeoff(runwayFreeForTakeoff.id);
        runwayFreeForTakeoff.assignPlaneToHandle(event.sender.id);
        break;
      case "end_landing":
      case "end_takeoff":
        const runwayId = (event.sender as Plane).freeFromRunway();
        if (!runwayId) return;
        this.runways.find((r) => r.id === runwayId)?.freePlane();
        break;
    }
  }
}

// Code client
function main() {
  const towerControl = new MainTowerControl();

  const runways = [
    new Runway({ id: "runway-1", onRunwayPlaneId: null }),
    new Runway({ id: "runway-2", onRunwayPlaneId: null }),
  ];

  const planes = [
    new Plane({
      id: "plane-1",
      state: "off",
      runwayIdToLandOn: null,
      runwayIdToTakeOfFrom: null,
    }),
    new Plane({
      id: "plane-2",
      state: "off",
      runwayIdToLandOn: null,
      runwayIdToTakeOfFrom: null,
    }),
    new Plane({
      id: "plane-3",
      state: "off",
      runwayIdToLandOn: null,
      runwayIdToTakeOfFrom: null,
    }),
    new Plane({
      id: "plane-4",
      state: "flying",
      runwayIdToLandOn: null,
      runwayIdToTakeOfFrom: null,
    }),
  ];

  // ... est un opérateur de décomposition (spread operator), je passe deux tableaux en liste d'arguments
  // Comme si je faisais towerControl.register(planes[0], planes[1], planes[2], planes[3], runways[0], runways[1]);
  towerControl.register(...planes, ...runways);

  const aFlyingPlane = planes.find((plane) => plane.is("flying"))!;
  const offPlanes = planes.filter((plane) => !plane.is("flying"));

  offPlanes.forEach((plane) => plane.askForTakeoff());

  var askForLandingInterval = setInterval(() => {
    if (!aFlyingPlane.is("flying")) {
      clearInterval(askForLandingInterval);
      return;
    }
    aFlyingPlane.askForLanding();
  }, 1000);
}

main();
