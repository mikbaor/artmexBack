/**
 * require idShovelCharge in replacement query
 * @returns 
 * query string
 */
let getDetailShovelCharge = () => {
    return `
    SELECT
        sho.id,
        sho."depositStoreId",
        COALESCE(sho."boxesAmmount", 0) as "boxesAmmount",
        COALESCE(sho."tarimasAmmount", 0) as "tarimasAmmount" ,
        COALESCE(sho."totalWeight", 0) as "totalWeight",
        TRIM(CONCAT(chofe."firstName", ' ', COALESCE(chofe."lastName", ''))) as "chofer_name",
        COALESCE(chofe."company", 'none') as "chofer_company",
        COALESCE(tra."placaCode", 'none') as "trailer_placa",
        COALESCE(tra."boxNumber", 'none') as "trailer_box_number",
        COALESCE(tra."company", 'none') as "trailer_company",
        COALESCE(sto.name, 'none') as "store",
        COALESCE(sto.country, 'none') as "country",
        COALESCE(sto.state, 'none') as "state",
        COALESCE(sto.city, 'none') as "city",
        COALESCE(sto.address, 'none') as "address",
        COALESCE(desti.name, 'none') as "destiny_store",
        COALESCE(desti.country, 'none') as "destiny_country",
        COALESCE(desti.state, 'none') as "destiny_state",
        COALESCE(desti.city, 'none') as "destiny_city",
        COALESCE(desti.address, 'none') as "destiny_address"

    FROM "Shovelcharges" sho
        INNER JOIN "Chofers" as chofe on chofe.id = sho."ChoferId"
        INNER JOIN "Trailers" as tra on tra.id = sho."TrailerId"
        INNER JOIN "Stores" as sto on sto.id = sho."StoreId"
        INNER join "Stores" as desti on desti.id = sho."depositStoreId"
    WHERE sho.id = :idShovelCharge;
    `;
  };
  
  module.exports = getDetailShovelCharge
  