import {
  Box,
  Button,
  Card,
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
import { useEffect,  useState } from "react";
import { getProducts, createProduct,  deleteProduct as deleteProductService, updateProduct ,type Product } from "../../services/productService";

type ProductForm = {
  id?: number;
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

  
  const openAddProduct = () => {
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(emptyForm);
  };

  const saveProduct = async () => {
  if (!canSave) return;

  try {
    if (form.id) {
      await updateProduct(
        form.id,
        form.name.trim(),
        Number(form.priceMmk)
      );
    } else {
      await createProduct(
        form.name.trim(),
        Number(form.priceMmk)
      );
    }

    const updatedProducts = await getProducts();

    setProducts(updatedProducts);

    closeForm();
  } catch (error) {
    console.error(error);
  }
};
  const deleteProduct = async (productId: number) => {
  try {
    await window.api.products.delete(productId);

    const updatedProducts = await getProducts();

    setProducts(updatedProducts);
  } catch (error) {
    console.error(error);
  }
};

const editProduct = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      priceMmk: String(product.priceMmk),
    });
    setIsFormOpen(true);
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
    display: "flex",
    flexDirection: "column",
    gap: 1,
  }}
>
  {/* Header */}
  <Card
    sx={{
      borderRadius: 3,
      bgcolor: "primary.main",
      color: "white",
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "80px 1fr 180px 220px",
        },
        alignItems: "center",
        gap: 2,
        px: 3,
        py: 2,
      }}
    >
      <Typography sx={{fontWeight:700}}>ID</Typography>
      <Typography sx={{fontWeight:700}}>Product Name</Typography>
      <Typography sx={{fontWeight:700}}>Price</Typography>
      <Typography sx={{fontWeight:700}}>Actions</Typography>
    </Box>
  </Card>

  {/* Product Rows */}
  {products.map((product,index) => (
    <Card
      key={product.id}
      sx={{
        borderRadius: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "80px 1fr 180px 220px",
          },
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 2,
        }}
      >
        {/* Product ID */}
        <Chip
          label={`${index + 1}`}
          size="small"
          sx={{
            width: "fit-content",
            fontWeight: 600,
          }}
        />

        {/* Product Name */}
        <Typography
          fontWeight={600}
          sx={{
            fontSize: "1rem",
          }}
        >
          {product.name}
        </Typography>

        {/* Price */}
        <Typography
          sx={{
            color: "success.main",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          {product.priceMmk.toLocaleString()} MMK
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => editProduct(product)}
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
        </Box>
      </Box>
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
