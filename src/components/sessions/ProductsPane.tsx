import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import type { Product } from "../../services/productService";
import type { SessionWithDetails } from "../../context/SessionContext";

interface Props {
  open: boolean;
  onClose: () => void;
  session: SessionWithDetails;
  onRefresh: () => void;
}

export default function ProductsPane({ open, onClose, session, onRefresh }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const addItem = async (product: Product) => {
    await window.api.sessions.addItem({
      sessionId: session.id,
      productId: product.id,
      unitPriceMmk: product.priceMmk,
    });
    onRefresh();
  };

  const changeItemQty = async (productId: number, qty: number) => {
    await window.api.sessions.changeItemQty({
      sessionId: session.id,
      productId,
      qty,
    });
    onRefresh();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 2 }}>
        <Typography variant="h6">Products</Typography>

        {products.map((p) => {
          const qty = session.items.find((it) => it.productId === p.id)?.qty || 0;

          return (
            <Box key={p.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
              <div>
                <Typography>{p.name}</Typography>
                <Typography variant="caption" color="text.secondary">{p.priceMmk.toLocaleString()} MMK</Typography>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (qty - 1 <= 0) changeItemQty(p.id, 0);
                    else changeItemQty(p.id, qty - 1);
                  }}
                >
                  <RemoveIcon />
                </IconButton>

                <Typography>{qty}</Typography>

                <IconButton
                  size="small"
                  onClick={() => addItem(p)}
                >
                  <AddIcon />
                </IconButton>
              </div>
            </Box>
          );
        })}

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={onClose} fullWidth>
            Done
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
