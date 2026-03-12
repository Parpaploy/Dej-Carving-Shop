"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Truck,
  Phone,
  MapPin,
  User,
  Banknote,
  QrCode,
  Copy,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "@/app/context/LocaleContext";
import { toast } from "sonner";

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLocale();

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "promptpay">("bank_transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDocumentId, setOrderDocumentId] = useState("");

  // Transfer proof upload states
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [uploadedProofUrl, setUploadedProofUrl] = useState("");

  // Redirect if not logged in
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error(t("toast.pleaseLogin"));
      router.push("/login");
    }
  }, [router]);

  // Redirect if cart is empty (and not in order-complete state)
  React.useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [cart, orderComplete, router]);

  const generateOrderNumber = () => {
    const now = new Date();
    const y = now.getFullYear().toString().slice(-2);
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `DEJ-${y}${m}${d}-${rand}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      toast.error(t("toast.pleaseLogin"));
      router.push("/login");
      return;
    }

    const newOrderNumber = generateOrderNumber();

    try {
      const orderRes = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders`,
        {
          data: {
            orderNumber: newOrderNumber,
            orderDate: new Date().toISOString(),
            totalAmount: cartTotal,
            status: "pending",
            recipientName,
            phone,
            shippingAddress,
            paymentMethod,
            products: cart.map((item) => item.id),
            user: user?.id,
          },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      setOrderNumber(newOrderNumber);
      setOrderDocumentId(orderRes.data.data.documentId);
      setOrderComplete(true);
      clearCart();
      toast.success(t("toast.orderSuccess"));
    } catch (err) {
      console.error("Order failed:", err);
      toast.error(t("toast.orderFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("toast.copied"));
  };

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error(t("checkout.uploadErrorType"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("checkout.uploadErrorSize"));
      return;
    }

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleProofUpload = async () => {
    if (!proofFile || !orderDocumentId) return;
    setIsUploading(true);

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const formData = new FormData();
    formData.append("file", proofFile);
    formData.append("orderId", orderDocumentId);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/transfer-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadedProofUrl(res.data.url);
      setProofUploaded(true);
      toast.success(t("checkout.uploadSuccess"));
    } catch {
      toast.error(t("checkout.uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const clearProofFile = () => {
    setProofFile(null);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(null);
  };

  // === ORDER COMPLETE STATE ===
  if (orderComplete) {
    return (
      <main className="w-full min-h-screen bg-cream py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl shadow-lg p-8 border-t-4 border-[#2D6A4F] text-center">
            <CheckCircle size={64} className="text-[#2D6A4F] mx-auto mb-4" />
            <h1 className="text-h3 font-serif text-teak-dark font-bold mb-2">
              {t("checkout.success")}
            </h1>

            <div className="bg-cream rounded-lg p-4 mb-6">
              <p className="text-sm text-text-muted mb-1">{t("checkout.orderNumber")}</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-h4 font-bold text-teak-dark">{orderNumber}</p>
                <button onClick={() => copyToClipboard(orderNumber)} className="text-gold hover:text-gold-hover p-1" aria-label="Copy">
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-cream-alt rounded-lg p-6 text-left mb-6">
              <h3 className="text-body font-bold text-teak-dark mb-3">
                {paymentMethod === "bank_transfer" ? t("checkout.bankDetails") : "PromptPay"}
              </h3>

              {paymentMethod === "bank_transfer" ? (
                <div className="space-y-2 text-body text-text-main">
                  <p><span className="text-text-muted">{t("checkout.bankLabel")}</span> {t("checkout.bankName")}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted">{t("checkout.accountNumberLabel")}</span>
                    <span className="font-bold">XXX-X-XXXXX-X</span>
                    <button onClick={() => copyToClipboard("XXX-X-XXXXX-X")} className="text-gold hover:text-gold-hover p-1"><Copy size={16} /></button>
                  </div>
                  <p><span className="text-text-muted">{t("checkout.accountNameLabel")}</span> {t("common.shopName")}</p>
                  <p className="font-bold text-price mt-2">{t("checkout.transferAmount")} ฿{cartTotal > 0 ? cartTotal.toLocaleString() : orderNumber ? t("checkout.seeEmail") : "0"}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-white w-48 h-48 mx-auto rounded-lg border border-cream-alt flex items-center justify-center mb-3">
                    <QrCode size={80} className="text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted">{t("checkout.scanPromptpay")}</p>
                </div>
              )}

              <p className="text-sm text-text-muted mt-4 border-t border-cream pt-3">
                {t("checkout.payWithin24h")}
              </p>
            </div>

            {/* Transfer Proof Upload */}
            <div className="bg-cream-alt rounded-lg p-6 text-left mb-6 border border-gold-soft/30">
              <h3 className="text-body font-bold text-teak-dark mb-2 flex items-center gap-2">
                <Upload size={20} className="text-gold" />
                {t("checkout.uploadProofTitle")}
              </h3>
              <p className="text-sm text-text-muted mb-4">{t("checkout.uploadProofDesc")}</p>

              {proofUploaded ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 mb-3">
                    <CheckCircle size={18} />
                    <span className="font-medium text-sm">{t("checkout.uploadSuccess")}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${uploadedProofUrl}`}
                      alt="Transfer proof"
                      className="max-h-48 mx-auto rounded-lg border border-cream-alt shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {proofPreview ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img
                          src={proofPreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg border border-cream-alt shadow-sm"
                        />
                        <button
                          onClick={clearProofFile}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={handleProofUpload}
                          disabled={isUploading}
                          className={`w-full py-3 rounded-lg font-bold text-body flex items-center justify-center gap-2 transition-all ${
                            isUploading
                              ? "bg-text-muted text-cream cursor-not-allowed"
                              : "bg-teak text-cream hover:bg-teak-dark"
                          }`}
                        >
                          {isUploading ? (
                            t("checkout.uploading")
                          ) : (
                            <>
                              <Upload size={18} />
                              {t("checkout.uploadButton")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/40 rounded-lg p-6 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all">
                      <ImageIcon size={36} className="text-gold/60 mb-2" />
                      <span className="text-sm font-medium text-teak-dark">{t("checkout.uploadChoose")}</span>
                      <span className="text-xs text-text-muted mt-1">JPG, PNG, WebP (max 5MB)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleProofSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="flex-1 bg-gold text-cream py-3 rounded-lg font-bold text-center hover:bg-gold-hover transition-colors min-h-[48px] flex items-center justify-center"
              >
                {t("checkout.continueShopping")}
              </Link>
              <Link
                href="/profile"
                className="flex-1 border-2 border-teak text-teak py-3 rounded-lg font-bold text-center hover:bg-teak hover:text-cream transition-colors min-h-[48px] flex items-center justify-center"
              >
                {t("checkout.myOrders")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // === CHECKOUT FORM ===
  return (
    <main className="w-full min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 hover:bg-cream-alt rounded-full transition-colors" aria-label={t("common.back")}>
            <ArrowLeft size={28} className="text-teak-dark" />
          </Link>
          <div>
            <h1 className="text-h3 font-serif text-teak-dark font-bold">{t("checkout.title")}</h1>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT: FORM */}
            <div className="flex-grow space-y-6">

              {/* SHIPPING INFO */}
              <div className="bg-card rounded-xl shadow-md p-6 border border-gold-soft/20">
                <h2 className="text-h5 font-serif text-teak-dark font-bold mb-5 flex items-center gap-2">
                  <Truck size={22} className="text-gold" />
                  {t("checkout.shippingInfo")}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="recipientName" className="text-body font-bold text-teak-dark flex items-center gap-2 mb-1">
                      <User size={18} className="text-gold" /> {t("checkout.recipientName")}
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={t("checkout.recipientPlaceholder")}
                      className="w-full py-3 px-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-body font-bold text-teak-dark flex items-center gap-2 mb-1">
                      <Phone size={18} className="text-gold" /> {t("checkout.phone")}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full py-3 px-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="text-body font-bold text-teak-dark flex items-center gap-2 mb-1">
                      <MapPin size={18} className="text-gold" /> {t("checkout.address")}
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={t("checkout.addressPlaceholder")}
                      className="w-full py-3 px-4 text-body border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="bg-card rounded-xl shadow-md p-6 border border-gold-soft/20">
                <h2 className="text-h5 font-serif text-teak-dark font-bold mb-5 flex items-center gap-2">
                  <CreditCard size={22} className="text-gold" />
                  {t("checkout.paymentMethod")}
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-gold bg-gold/5"
                        : "border-cream-alt hover:border-gold-soft"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="w-5 h-5 accent-[#6b4c38]"
                    />
                    <Banknote size={24} className="text-teak flex-shrink-0" />
                    <div>
                      <p className="font-bold text-teak-dark">{t("checkout.bankTransfer")}</p>
                      <p className="text-sm text-text-muted">{t("checkout.bankTransferSub")}</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "promptpay"
                        ? "border-gold bg-gold/5"
                        : "border-cream-alt hover:border-gold-soft"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="promptpay"
                      checked={paymentMethod === "promptpay"}
                      onChange={() => setPaymentMethod("promptpay")}
                      className="w-5 h-5 accent-[#6b4c38]"
                    />
                    <QrCode size={24} className="text-teak flex-shrink-0" />
                    <div>
                      <p className="font-bold text-teak-dark">{t("checkout.promptpay")}</p>
                      <p className="text-sm text-text-muted">{t("checkout.promptpaySub")}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:w-[360px] flex-shrink-0">
              <div className="bg-card rounded-xl shadow-lg p-6 border-t-4 border-gold sticky top-24">
                <h2 className="text-h5 font-serif text-teak-dark font-bold mb-4">{t("checkout.orderSummary")}</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 bg-cream-alt rounded-lg overflow-hidden flex-shrink-0 border border-gold-soft/20">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-teak-dark truncate">{item.name}</p>
                        <p className="text-sm text-text-muted">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-price flex-shrink-0">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-alt pt-4 space-y-2 text-body">
                  <div className="flex justify-between text-text-muted">
                    <span>{t("checkout.subtotal")}</span>
                    <span className="text-text-main">฿{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>{t("checkout.shippingCost")}</span>
                    <span className="text-[#2D6A4F] font-bold">{t("common.free")}</span>
                  </div>
                  <div className="h-px bg-cream-alt my-2" />
                  <div className="flex justify-between text-h5 font-bold text-teak-dark">
                    <span>{t("checkout.total")}</span>
                    <span className="text-price">฿{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-6 text-cream text-body-lg font-bold py-4 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[56px] ${
                    isSubmitting ? "bg-text-muted cursor-not-allowed" : "bg-teak hover:bg-teak-dark"
                  }`}
                >
                  {isSubmitting ? (
                    t("checkout.placing")
                  ) : (
                    <>
                      <CreditCard size={22} />
                      {t("checkout.placeOrder")}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-text-muted mt-3">
                  {t("checkout.orderNote")}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
