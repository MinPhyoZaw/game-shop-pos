export interface Product {
  id: number;
  name: string;
  priceMmk: number;
}
export async function createProduct(
  name: string,
  priceMmk: number
) {
  return await window.api.products.create({
    name,
    priceMmk,
  });
}

export async function deleteProduct(id: number) {
  return await window.api.products.delete(id);
}

export async function updateProduct(id:number,name:string,price:number){
  return await window.api.products.update({
    id,
    name,
    priceMmk:price
  });
}
export const getProducts = async (): Promise<Product[]> => {
  return await window.api.products.getAll();
};
