type AirportComponentType = Plane | Runway;

abstract class AirportComponent {
  protected towerControl: TowerControl | null = null;

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }
}

type RunwayProps = {
  id: string;
};

class Runway extends AirportComponent {
  constructor(private readonly props: RunwayProps) {
    super();
  }

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }
}

type PlaneProps = {
  id: string;
  state: "off" | "landing" | "takeoff" | "flying";
  onRunwayId: string | null;
};

class Plane extends AirportComponent {
  constructor(private readonly props: PlaneProps) {
    super();
  }

  assignTowerControl(towerControl: TowerControl): void {
    this.towerControl = towerControl;
  }

  is(state: PlaneProps["state"]): boolean {
    return this.props.state === state;
  }
}

interface TowerControl {
  notify(sender: AirportComponentType): void;
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

  register(...components: AirportComponent[]): void {
    components.forEach((c) => c.assignTowerControl(this));
    this.airportComponents.push(...components);
  }

  notify(sender: AirportComponentType): void {
    throw new Error("Method not implemented.");
  }
}

// Code client
function main() {
  const towerControl = new MainTowerControl();

  const runways = [
    new Runway({ id: "runway-1" }),
    new Runway({ id: "runway-2" }),
  ];

  const planes = [
    new Plane({
      id: "plane-1",
      state: "landing",
      onRunwayId: "runway-1",
    }),
    new Plane({
      id: "plane-2",
      state: "off",
      onRunwayId: null,
    }),
    new Plane({
      id: "plane-3",
      state: "takeoff",
      onRunwayId: "runway-2",
    }),
    new Plane({
      id: "plane-4",
      state: "flying",
      onRunwayId: null,
    }),
  ];

  towerControl.registerPlanes(...planes);
  towerControl.registerRunways(...runways);

  const flyingPlane = planes.find((plane) => plane.is("flying"));
}
