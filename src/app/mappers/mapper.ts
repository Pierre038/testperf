export interface Mapper<DomainObject, AppObject> {
  /**
   * mappe un objet utilisé par l'application sur un objet métier (issu d'une BAPI par exemple)
   * @param appObject: objet à mapper
   */
  toDomainModel(appObject: AppObject): DomainObject;
  /**
   * mappe un objet métier (issu d'une BAPI par exemple) sur un objet utilisé par l'application
   * @param domainObject: objet à mapper
   */
  toAppModel(domainObject: DomainObject): AppObject;
  /**
   * mappe une collection d'objets métier sur une collection d'objet utilisé par l'application
   * @param domainObjectCollection : collection d'objet métier à mapper
   */
  toAppModelCollection?(domainObjectCollection: DomainObject[]): AppObject[];
}
