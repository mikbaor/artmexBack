/**
 * require idShovelCharge in replacement query
 * @returns 
 * query string
 */
let getInfoShovel = () => {
    return `
    SELECT
        sho.id,
        sho."depositStoreId",
        COALESCE(sho.observations, '  ') as "observations",
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


/**
 * require idShovelCharge in replacement query
 * @returns 
 * query string
 */
let getProductShovel = () => {
    return `
    SELECT  
        pro.id,
        pro.name,
        pro.tipo,
        pro."colorPrimario",
        pro."colorSecundario",
        SUM(COALESCE(box_am.ammount, 0)) as ammount_total,
        COUNT(bx) as "countBoxes"
    FROM "Products" as pro
        INNER JOIN "Boxammounts" as box_am on box_am."ProductId" = pro.id
        INNER JOIN "Boxes" as bx on bx.id = box_am."BoxId" and bx.type = 'empaque'
    WHERE 
        bx."TarimaId" = ANY (
            SELECT ta_sho."TarimaId" FROM "TarimaShovelcharge" ta_sho
            WHERE ta_sho."ShovelchargeId" = :idShovelCharge
        )OR
        bx.id = ANY (
            SELECT bx_sho."BoxId" FROM "BoxShovelcharge" bx_sho
            WHERE bx_sho."ShovelchargeId" = :idShovelCharge
        )
    GROUP BY pro.id ORDER BY pro.name;
    `;
};

module.exports = {
    getInfoShovel,
    getProductShovel
}