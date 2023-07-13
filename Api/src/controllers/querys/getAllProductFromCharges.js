let getAmountsAllProducts = (idShovelCharge) => {
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
            WHERE ta_sho."ShovelchargeId" = ${idShovelCharge}
        )OR
        bx.id = ANY (
            SELECT bx_sho."BoxId" FROM "BoxShovelcharge" bx_sho
            WHERE bx_sho."ShovelchargeId" = ${idShovelCharge}
        )
    GROUP BY pro.id ORDER BY pro.name;
    `;
};

module.exports = getAmountsAllProducts
