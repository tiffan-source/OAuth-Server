# Mon API TypeScript

Cette API est construite en utilisant les principes de la Clean Architecture. Elle est écrite en TypeScript et utilise Node.js pour le runtime.

## Architecture

L'architecture de cette API suit les principes de la Clean Architecture. Elle est divisée en plusieurs couches :

- **Domaine** : Cette couche contient les entités métier de l'application ainsi que les règles de gestion qui leur sont associées.
- **Application** : Cette couche contient les cas d'utilisation de l'application. Elle utilise les entités métier du domaine pour implémenter les fonctionnalités de l'API.
- **Infrastructure** : Cette couche contient les détails techniques de l'application, tels que les bases de données, les services externes, etc.

## Installation

Pour installer cette API, vous devez d'abord cloner le dépôt :
