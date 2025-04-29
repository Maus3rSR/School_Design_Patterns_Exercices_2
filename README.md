# TP sur les designs patterns

- Dans chacun des scénarios, choisissez un design pattern adapté et écrivez le pseudo-code correspondant au scénario.
- Par défaut nous utilisons le langage TypeScript. Néanmoins vous pouvez utiliser le langage de votre choix (Python, JavaScript, C#, Java, etc.) pour écrire les exercices.
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

### Scénario B - Flying nugget airlines

Dû à une augmentation du traffic aérien et en attendant l'ajout de nouvelles pistes d'atterissage pour accueillir au mieux ce traffic, une compagnie aérienne a besoin d'un nouveau système pour la tour de contrôle.

Ce système doit permettre de faire la gestion de l'atterissage et du décollage des avions sur les difféntes pistes, au travers de la tour de contrôle.

C'est la tour de contrôle qui a responsabilité de gérer la communication entre les avions et les pistes d'atterissage et d'opérer les différentes actions entre elles.

### Scénario C - TéléKommande

Une compagnie souhaite s'insérer sur le marché des télévisions intélligentes, où les télécommmandes ont des boutons permettant d'afficher directement des applications comme Netflix, Amazon Prime, Disney+, et les chaînes courantes. On peut effectuer des actions sur la télévision associée. On pourrait effectuer les actions suivantes :

- Allumer la télévision
- Eteindre la télévision
- Bouton pour lancer l'application Netflix
- Bouton pour lancer l'application Amazon Prime
- Bouton pour lancer l'application Disney+
- Bouton pour afficher un numéro de chaîne

Dans le futur, notre algorithme doit pouvoir effectuer un retour en arrière sur les actions. Par exemple, après avoir allumer la télévision, mis Netflix puis Amazon Prime, un bouton pour revenir en arrière permettrait de revenir sur la chaîne/application précédemment lancée.

### Scénario D - IAvomatique

Une entreprise a créé un lavomatique intelligent fonctionnant sur une IA entraînée qui permet de laver nos vêtements avec un tri automatique avant lavage.
Les clients peuvent donc choisir comment trier les vêtements de plusieurs façons :

- Par couleur (blancs, couleurs claires, couleurs foncées)
- Par type de tissu (coton, laine, synthéthique)
- Par niveau de saleté (vêtements très sales séparées des autres)

### Scénario E - Le Coin des Lecteurs Paresseux

Une grande bibliothèque prestigieuse souhaite permettre à ses lecteurs paresseux de ne pas passer trop de temps à trouver un nouveau livre à lire à découvrir.
Cette bibliothèque met en place un logiciel permettant de parcourir les livres de différentes façon, selon un type de parcours.

Le lecteur, depuis une interface, peut choisir de parcourir les livres par :

- Nom de l'oeuvre
- Auteur
- Genre littéraire
- Date d'acquisition de la bibliothèque

Lorsqu'il lance une recherche en indiquant le type de recherche, un livre lui est présenté à l'écran. Il peut faire suivant pour voir le prochain livre, etc. Jusqu'à trouver un livre qui lui convient dont il pourra trouver le numéro de la zone et le numéro d'emplacement dans la bibliothèque pour le trouver et le lire.

### Scénario F - Picsou Bank

Dans une banque renommée, les prêts doivent être approuvés dans la hierarchie de la banque en fonction du montant du prêt.

En fonction du montant, le prêt doit être approuvé par un responsable accrédité pour valider le montant.

Pour les montants entre

- 0 et 100 000, le prêt est approuvé par l'employé de la banque
- 100 000 et 500 000, le prêt est approuvé par le manager de l'équipe
- 500 000 et 10 000 000, le prêt est approuvé par le chef de département
- 10 000 000 et plus, le prêt est approuvé par le directeur Financier
