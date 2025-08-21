import os
from PIL import Image, ImageOps

# === Настройки ===
BASE_FOLDER = r"F:/work/other/seat-constructor/img"
WEBP_QUALITY = 100        # Аналог Quality 100 в Squoosh
WEBP_METHOD = 6           # Аналог Effort 6 (диапазон 0..6)
LOSSLESS = False          # False = как в Squoosh при Quality=100 (lossy)
DELETE_SOURCE_PNG = False # True — удалять исходный .png после конвертации
REENCODE_WEBP = False     # True — пересохранять даже существующие .webp с нужными параметрами

def save_webp(img: Image.Image, path: str):
    """Сохранение в WEBP с заданными настройками."""
    # Если у изображения палитра/нет альфы — Pillow сам конвертирует
    img.save(
        path,
        "WEBP",
        quality=WEBP_QUALITY,
        method=WEBP_METHOD,
        lossless=LOSSLESS,
        exact=False  # если True — сохраняет точные альфа-границы, но медленнее/крупнее
    )

def mirror_overwrite_webp(path: str):
    """Зеркалит .webp по горизонтали и сохраняет поверх."""
    with Image.open(path) as im:
        mirrored = ImageOps.mirror(im)
        # Сохраняем с теми же настройками (или без перекодирования, если не надо менять параметры)
        save_webp(mirrored, path)

def convert_png_to_webp(png_path: str, webp_path: str):
    """Конвертирует PNG -> WEBP с заданными настройками."""
    with Image.open(png_path) as im:
        # Гарантируем наличие альфы, если она была (WebP lossy поддерживает альфу)
        if im.mode not in ("RGBA", "RGB"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        save_webp(im, webp_path)

def process_folder(base_folder: str):
    for root, _, files in os.walk(base_folder):
        # Сначала конвертируем PNG -> WEBP
        for file in files:
            if file.lower().endswith(".png"):
                png_path = os.path.join(root, file)
                webp_path = os.path.join(root, os.path.splitext(file)[0] + ".webp")
                try:
                    convert_png_to_webp(png_path, webp_path)
                    print(f"[PNG→WEBP] {png_path}  ->  {webp_path}")
                    if DELETE_SOURCE_PNG:
                        try:
                            os.remove(png_path)
                            print(f"[DEL]      {png_path}")
                        except Exception as e_del:
                            print(f"[WARN] Не удалось удалить {png_path}: {e_del}")
                except Exception as e:
                    print(f"[ERR] PNG конвертация {png_path}: {e}")

        # Затем зеркалим все WEBP (включая только что созданные)
        for file in files:
            if file.lower().endswith(".webp"):
                webp_path = os.path.join(root, file)
                try:
                    # Если не хотим перекодировать уже готовые webp,
                    # но хотим зеркалить: зеркалим и сохраняем без смены параметров.
                    # В Pillow при сохранении всё равно произойдёт перекодирование.
                    # Если REENCODE_WEBP=False, это только семантический флаг.
                    if REENCODE_WEBP:
                        mirror_overwrite_webp(webp_path)
                    else:
                        mirror_overwrite_webp(webp_path)
                    print(f"[MIRROR]   {webp_path}")
                except Exception as e:
                    print(f"[ERR] Зеркалка {webp_path}: {e}")

if __name__ == "__main__":
    process_folder(BASE_FOLDER)
    print("Готово! Все PNG сконвертированы в WEBP и все WEBP отзеркалены.")
