let getDetailShovelCharge = (idShovelCharge) => {
    return `
    SELECT
        sho.id,
        sho."depositStoreId",
        COALESCE(sho."boxesAmmount", 0) as "boxesAmmount",
        COALESCE(sho."tarimasAmmount", 0) as "tarimasAmmount" ,
        COALESCE(sho."totalWeight", 0) as "totalWeight",
        TRIM(CONCAT(chofe."firstName", ' ', COALESCE(chofe."lastName", ''))) as "chofer",
        tra."placaCode" as "placa",
        COALESCE(sto.name, '') as "store",
        COALESCE(sto.country, '') as "country",
        COALESCE(sto.state, '') as "state",
        COALESCE(sto.city, '') as "city",
        COALESCE(sto.address, '') as "address",
        COALESCE(desti.name, '') as "destiny_store",
        COALESCE(desti.country, '') as "destiny_country",
        COALESCE(desti.state, '') as "destiny_state",
        COALESCE(desti.city, '') as "destiny_city",
        COALESCE(desti.address, '') as "destiny_address"

    FROM "Shovelcharges" sho
        INNER JOIN "Chofers" as chofe on chofe.id = sho."ChoferId"
        INNER JOIN "Trailers" as tra on tra.id = sho."TrailerId"
        INNER JOIN "Stores" as sto on sto.id = sho."StoreId"
        INNER join "Stores" as desti on desti.id = sho."depositStoreId"
    WHERE sho.id = ${idShovelCharge};
    `;
  };
  
  module.exports = getDetailShovelCharge
  