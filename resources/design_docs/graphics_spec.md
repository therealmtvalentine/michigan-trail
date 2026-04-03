# Michigan Trail - Graphics Specification

## Art Style Reference

Based on analysis of the reference image (`Gemini_Generated_Image_ktimciktimciktim.png`):

### Visual Characteristics
- **Era**: 1980s 16-bit pixel art style (Oregon Trail / early DOS games)
- **Pixel Density**: Visible individual pixels, no anti-aliasing
- **Dithering**: Classic dithering patterns for gradients and shading
- **Color Palette**: Limited palette per scene, warm earth tones dominant
- **Perspective**: Side-scrolling 2D with layered parallax backgrounds

### Color Guidelines
- **Sky**: Gradient from deep blue to warm orange/yellow at horizon
- **Terrain**: Earthy browns, muted greens, dusty tans
- **Vegetation**: Sage greens, olive tones
- **Accents**: Warm sunset oranges, cool mountain purples

### Composition Layers (back to front)
1. Sky with clouds
2. Distant mountains/city skyline
3. Mid-ground terrain/buildings
4. Road/path
5. Foreground vegetation
6. Characters/vehicles (sprites)

---

## Base Prompt Template

```
[SUBJECT DESCRIPTION], pixel art, 1980s retro video game style like Oregon Trail, 16-bit graphics, visible pixels, dithering effects, [COLOR PALETTE], [PERSPECTIVE]
```

### Prompt Modifiers by Category

**Backgrounds (1024x576)**
```
wide landscape scene, side-scrolling game perspective, layered parallax background, warm color palette
```

**Landmarks (512x384)**
```
detailed building/monument illustration, centered composition, clear focal point, informational style
```

**Sprites (various sizes)**
```
character sprite, transparent background, clean pixel edges, game asset style, isolated subject
```

**Popups/Events (256x256)**
```
event illustration, dramatic composition, clear storytelling, centered subject, vignette style
```

---

## Image Categories & Dimensions

| Category | Dimensions | Use Case |
|----------|------------|----------|
| background | 1024x576 | Full scene backgrounds, cities, driving scenes |
| landmark | 512x384 | Tourist attractions, points of interest |
| sprite | varies | Characters, vehicles, items |
| popup | 256x256 | Event illustrations, notifications |

See `graphics_list.csv` for complete asset list with categories and prompts.

---

## Generation Notes

- All prompts are stored in `graphics_list.csv` for easy revision
- Test images should be reviewed before batch generation
- Sprites may need post-processing for transparency
