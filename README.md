# TP noté sur les designs patterns

- Dans chacun des scénarios, choisissez un design pattern adapté et écrivez le pseudo-code correspondant au scénario.
- Vous pouvez utiliser le langage de votre choix (Python, JavaScript, C#, Java, etc.) pour écrire les exercices.
- Le code n'a pas forcément besoin d'être fonctionnel, le but est d'écrire du pseudo-code représentant un design pattern. Cependant cela est mieux si le langage ne relève pas d'erreur à l'écriture du code dans le cas des langages typés.
- Pour chaque design pattern implémenté, écrivez un exemple d'utilisation.

## Exemple pour un pattern singleton :

**Scénario** :
Dans une application de gestion scolaire, plusieurs composants ont besoin d'accéder à la configuration centrale (chemin des fichiers, paramètres de connexion). Nous devons garantir qu'une seule instance existe et soit accessible partout.

**Pseudo-Code pattern Singleton écrit en TypeScript** :

```typescript
class Config {
  private static instance: Config;
  private hashmap: { [key: string]: string } = {};

  private constructor() {}

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getValue(key: string): string {
    return this.hashmap[key];
  }

  public setValue(key: string, value: string): void {
    this.hashmap[key] = value;
  }
}

/**
 * Code client qui représente un exemple d'utilisation du pattern Singleton.
 */
const config1 = Config.getInstance();

config1.setValue("log_path", "log.txt");
config1.setValue("db_connection_user", "SchoolAdm04786543");
config1.setValue("db_connection_database", "SchoolAdm_db_04786543");

// En récupérant l'instance du singleton, nous pouvons accéder aux mêmes données de la même instance de la classe Config
const config2 = Config.getInstance();

// Preuve du que le Singleton partage les mêmes données et instance
console.log(config2.getValue("log_path") === "log.txt"); // Devrait être à vrai
console.log(config1 === config2); // Devrait être à vrai car même référence mémoire (même instance de classe)
```

## Scénarios

### Scénario A - Mortel Kebap

Un jeu très attendu, Mortel Kebap, est en cours de développement. C'est un jeu de combat où les personnages peuvent faire les actions suivantes :

- Ne rien faire (on parle d'IDLE)
- Attaquer
- Se déplacer à une certaine vitesse
- Sauter

**Dans certaines situations, le personnages peut, ou ne peut faire certaines actions :**

Quand le personnage ne fait rien, il peut :

- Attaquer
- Se déplacer
- Sauter

Quand le personnage attaque, il peut :

- Attaquer

Quand le personnage se déplace, il peut :

- Sauter
- Attaquer

Quand le personnage saute, il peut :

- Attaquer

Quand le pernnage est étourdi pendant quelques secondes, il ne peut rien faire

### Scénario B

### Scénario C

### Scénario D - IAvomatique

Une entreprise a créé un lavomatique intelligent fonctionnant sur une IA entraînée qui permet de laver nos vêtements avec un tri automatique avant lavage.
Les clients peuvent donc choisir comment trier les vêtements de plusieurs façons :

- Par couleur (blancs, couleurs claires, couleurs foncées)
- Par type de tissu (coton, laine, synthéthique)
- Par niveau de saleté (vêtements très sales séparées des autres)

### Scénario E

### Scénario F
