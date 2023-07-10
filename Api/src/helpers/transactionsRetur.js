const createReturn = async (returnData) => {
  const { products } = returnData;

  try {
    const returnObj = await Return.create(returnData, { transaction });

    const productIds = products.map((product) => product.id);

    const updatedProducts = await Product.findAll({
      where: { id: productIds },
    });

    for (const product of updatedProducts) {
      const updatedProduct = products.find((p) => p.id === product.id);
      const returnAmmount = updatedProduct.returnAmmount;

      await Product.decrement("ammount", returnAmmount, {
        where: { id: product.id },
        transaction,
      });

      await ReturnProduct.create(
        {
          ReturnId: returnObj.id,
          ProductId: product.id,
          quantity: updatedProduct.quantity,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return returnObj;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createReturn,
};
