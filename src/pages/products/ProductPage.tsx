import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "../../services/productService";

type ProductForm = {
  id?: string;
  name: string;
  priceMmk: string;
};

const emptyForm: ProductForm = {
  name: "",
  priceMmk: "",
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const isEditing = Boolean(form.id);
  const canSave = form.name.trim().length > 0 && Number(form.priceMmk) > 0;

  const nextProductId = useMemo(() => {
    const maxNumericId = products.reduce((max, product) => {
      const parsedId = Number(product.id);
      return Number.isFinite(parsedId) ? Math.max(max, parsedId) : max;
    }, 0);

    return String(maxNumericId + 1);
  }, [products]);

  const openAddProduct = () => {
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      priceMmk: String(product.priceMmk),
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(emptyForm);
  };

  const saveProduct = () => {
    if (!canSave) return;

    const productData: Product = {
      id: form.id ?? nextProductId,
      name: form.name.trim(),
      priceMmk: Number(form.priceMmk),
    };

    setProducts((currentProducts) => {
      if (form.id) {
        return currentProducts.map((product) =>
          product.id === form.id ? productData : product,
        );
      }

      return [productData, ...currentProducts];
    });

    closeForm();
  };

  const deleteProduct = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box>
          <Typography variant="h3" component="h1" className="page-title">
            Products
          </Typography>
          <Typography className="page-subtitle">
            Manage shop items that can be added to a play session.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddProduct}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
        >
          Add Product
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {products.map((product) => (
          <Card key={product.id} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Chip label={`#${product.id}`} size="small" />
              </Box>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {product.priceMmk.toLocaleString()} MMK
              </Typography>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => openEditProduct(product)}
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {products.length === 0 && (
        <div className="empty-state">No products yet. Add your first product.</div>
      )}

      <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="xs">
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              label="Product name"
              value={form.name}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  name: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Price (MMK)"
              type="number"
              value={form.priceMmk}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  priceMmk: event.target.value,
                }))
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button variant="contained" onClick={saveProduct} disabled={!canSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
