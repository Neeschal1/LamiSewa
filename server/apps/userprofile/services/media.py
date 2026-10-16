from env_config import Config


def featured_urls(profile) -> list:
    try:
        featured = profile.featured_image
    except Exception:
        return []
    default = Config.DEFAULTUSERPROFILE
    urls = [featured.image1, featured.image2, featured.image3, featured.image4, featured.image5, featured.image6]
    return [u for u in urls if u and u != default]
