from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="dehug",
    version="0.2.2",
    author="DeHug Team",
    author_email="contact@dehug.io",
    description="Decentralized Hugging Face - AI models and datasets from IPFS/Filecoin",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/olagold-hackxx/dehug",
    project_urls={
        "Bug Tracker": "https://github.com/olagold-hackxx/dehug/issues",
        "Documentation": "https://docs.dehug.io",
        "Source Code": "https://github.com/olagold-hackxx/dehug",
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    packages=find_packages(exclude=["tests", "tests.*", "examples", "examples.*"]),
    python_requires=">=3.8",
    install_requires=["requests>=2.31.0", "pandas>=2.0.0", "pyarrow>=14.0.1"],
    entry_points={
        "console_scripts": [
            "dehug=dehug.cli:main",
            "dehug-server=dehug.server:run_server",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
